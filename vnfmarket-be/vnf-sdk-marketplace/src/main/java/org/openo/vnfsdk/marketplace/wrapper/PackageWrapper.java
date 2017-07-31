/**
 * Copyright 2017 Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.openo.vnfsdk.marketplace.wrapper;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import net.sf.json.JSONObject;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.openo.vnfsdk.marketplace.common.CommonConstant;
import org.openo.vnfsdk.marketplace.common.FileUtil;
import org.openo.vnfsdk.marketplace.common.JsonUtil;
import org.openo.vnfsdk.marketplace.common.RestUtil;
import org.openo.vnfsdk.marketplace.common.ToolUtil;
import org.openo.vnfsdk.marketplace.db.entity.PackageData;
import org.openo.vnfsdk.marketplace.db.exception.MarketplaceResourceException;
import org.openo.vnfsdk.marketplace.db.resource.PackageManager;
import org.openo.vnfsdk.marketplace.db.util.MarketplaceDbUtil;
import org.openo.vnfsdk.marketplace.entity.request.PackageBasicInfo;
import org.openo.vnfsdk.marketplace.entity.response.PackageMeta;
import org.openo.vnfsdk.marketplace.entity.response.UploadPackageResponse;
import org.openo.vnfsdk.marketplace.filemanage.FileManagerFactory;
import org.openo.vnfsdk.marketplace.onboarding.entity.OnBoardingOperResult;
import org.openo.vnfsdk.marketplace.onboarding.entity.OnBoardingResult;
import org.openo.vnfsdk.marketplace.onboarding.entity.OnBoardingSteps;
import org.openo.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.openo.vnfsdk.marketplace.onboarding.hooks.functiontest.FunctionTestExceutor;
import org.openo.vnfsdk.marketplace.onboarding.hooks.functiontest.FunctionTestHook;
import org.openo.vnfsdk.marketplace.onboarding.hooks.validatelifecycle.LifecycleTestExceutor;
import org.openo.vnfsdk.marketplace.onboarding.hooks.validatelifecycle.ValidateLifecycleTestResponse;
import org.openo.vnfsdk.marketplace.onboarding.onboardmanager.OnBoardingHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PackageWrapper {
    private static PackageWrapper packageWrapper;
    private static final Logger LOG = LoggerFactory.getLogger(PackageWrapper.class);

    /**
     * get PackageWrapper instance.
     * @return package wrapper instance
     */
    public static PackageWrapper getInstance() {
        if (packageWrapper == null) {
            packageWrapper = new PackageWrapper();
        }
        return packageWrapper;
    }

    public Response updateValidateStatus(InputStream inputStream, HttpHeaders head) throws Exception
    {
        String reqParam = IOUtils.toString(inputStream);
        LOG.info("updateValidateStatus request param:"+reqParam);
        if(StringUtils.isBlank(reqParam)) {
            LOG.error("The updateValidateStatus request params can't be null");
            return Response.status(Status.EXPECTATION_FAILED).build();
        }
        
        ValidateLifecycleTestResponse lyfValidateResp = JsonUtil.fromJson(reqParam, ValidateLifecycleTestResponse.class);
        if(!checkOperationSucess(lyfValidateResp))
        {
            return Response.status(Status.EXPECTATION_FAILED).build();
        }
        
        String funcTestResponse = FunctionTestExceutor.executeFunctionTest(reqParam);
        if(null == funcTestResponse)
        {
            return Response.status(Status.EXPECTATION_FAILED).build();
        }
        
        JSONObject funcTestRspObject = JSONObject.fromObject(funcTestResponse);   
        if(!funcTestRspObject.get("status").equals(CommonConstant.SUCCESS_STR))
        {
            return Response.status(Status.EXPECTATION_FAILED).build();
        }
                
        JSONObject result = new JSONObject(); 
        result.put("msg","SUCCESS");
        return Response.ok(ToolUtil.objectToString(result), MediaType.APPLICATION_JSON).build();
    }
    
    private boolean checkOperationSucess(ValidateLifecycleTestResponse lyfValidateResp) 
    {
        boolean bOperStatus = false;
        if(null == lyfValidateResp) 
        {
            LOG.error("ValidateLifecycleTestResponse  is NUll !!!");
            return bOperStatus;
        }
        if(lyfValidateResp.getLifecycle_status().equalsIgnoreCase(CommonConstant.SUCCESS_STR) 
                && lyfValidateResp.getValidate_status().equalsIgnoreCase(CommonConstant.SUCCESS_STR))
        {
            LOG.error("Lifecycle/Validation Response failed :" + lyfValidateResp.getLifecycle_status() + File.separator + lyfValidateResp.getValidate_status());
            bOperStatus =  true;
        }
        return bOperStatus;
    }

    /**
     * query package list by condition.
     * @param name package name
     * @param provider package provider
     * @param version package version
     * @param deletionPending package deletionPending
     * @param type package type
     * @return Response
     */
    public Response queryPackageListByCond(String name, String provider, String version,
            String deletionPending, String type) {
        ArrayList<PackageData> dbresult = new ArrayList<PackageData>();
        ArrayList<PackageMeta> result = new ArrayList<PackageMeta>();
        LOG.info("query package info.name:" + name + " provider:" + provider + " version" + version
                + " deletionPending" + deletionPending + " type:" + type);
        try {
            dbresult =
                    PackageManager.getInstance().queryPackage(name, provider, version, deletionPending, type);
            result = PackageWrapperUtil.packageDataList2PackageMetaList(dbresult);
            return Response.ok(ToolUtil.objectToString(result)).build();
        } catch (MarketplaceResourceException e1) {
            LOG.error("query package by csarId from db error ! " + e1.getMessage());
            return RestUtil.getRestException(e1.getMessage());
        }
    }

    /**
     * query package by id.
     * @param csarId package id
     * @return Response
     */
    public Response queryPackageById(String csarId) {
        PackageData dbResult = new PackageData();
        PackageMeta result = new PackageMeta();
        dbResult = PackageWrapperUtil.getPackageInfoById(csarId);
        result = PackageWrapperUtil.packageData2PackageMeta(dbResult);
        return Response.ok(ToolUtil.objectToString(result)).build();
    }

    /**
     * upload package.
     * @param uploadedInputStream inputStream
     * @param fileDetail package detail
     * @param head http header
     * @return Response
     * @throws Exception e
     */
    public Response uploadPackage(InputStream uploadedInputStream,
            FormDataContentDisposition fileDetail, String details, HttpHeaders head) throws Exception 
    {
        LOG.info("Upload/Reupload request Received !!!!");
        
        String packageId = MarketplaceDbUtil.generateId();
        return handlePackageUpload(packageId,uploadedInputStream, fileDetail, details, head);
    }

    /**
     * Interface for Uploading package
     * @param packageId
     * @param uploadedInputStream
     * @param fileDetail
     * @param details
     * @param head
     * @return
     * @throws IOException
     * @throws MarketplaceResourceException
     */
    private Response handlePackageUpload(String packageId,InputStream uploadedInputStream, FormDataContentDisposition fileDetail,
            String details, HttpHeaders head) throws IOException, MarketplaceResourceException 
    {     
        boolean bResult = handleDataValidate(packageId,uploadedInputStream,fileDetail);
        if(!bResult)
        {
            LOG.error("Validation of Input received for Package Upload failed !!!");
            return Response.status(Status.EXPECTATION_FAILED).build();
        }

        LOG.info("the fileDetail = " + ToolUtil.objectToString(fileDetail));

        String fileName = ToolUtil.processFileName(fileDetail.getFileName());
        String localDirName = ToolUtil.getTempDir(CommonConstant.CATALOG_CSAR_DIR_NAME, fileName);

        String contentRange = null;
        if (head != null) 
        {
            contentRange = head.getHeaderString(CommonConstant.HTTP_HEADER_CONTENT_RANGE);
        }
        LOG.info("store package chunk file, fileName:" + fileName + ",contentRange:" + contentRange);
        if (ToolUtil.isEmptyString(contentRange))
        {
            int fileSize = uploadedInputStream.available();
            contentRange = "0-" + fileSize + "/" + fileSize;
        }

        String fileLocation = ToolUtil.storeChunkFileInLocal(localDirName, fileName, uploadedInputStream);
        LOG.info("the fileLocation when upload package is :" + fileLocation);

        uploadedInputStream.close();

        PackageBasicInfo basicInfo = PackageWrapperUtil.getPacageBasicInfo(fileLocation);          
        if (null == basicInfo.getType() || null == basicInfo.getProvider() || null == basicInfo.getVersion()) 
        {
            LOG.error("Package basicInfo is incorrect ! basicIonfo = " + ToolUtil.objectToString(basicInfo));
            return Response.serverError().build();
        }

        UploadPackageResponse result = new UploadPackageResponse();      
        Boolean isEnd = PackageWrapperUtil.isUploadEnd(contentRange, fileName);
        if (isEnd) 
        {
            PackageMeta packageMeta = PackageWrapperUtil.getPackageMeta(packageId,fileName, fileLocation, basicInfo, details);
            
            String path =  basicInfo.getType().toString() + File.separator + basicInfo.getProvider() + File.separator +  packageMeta.getCsarId() + File.separator + fileName.replace(".csar", "") + File.separator + basicInfo.getVersion();
            String dowloadUri = File.separator + path + File.separator;
            packageMeta.setDownloadUri(dowloadUri);
            
            LOG.info("dest path is : " + path);
            LOG.info("packageMeta = " + ToolUtil.objectToString(packageMeta));

            PackageData packageData = PackageWrapperUtil.getPackageData(packageMeta);
            
            String destPath = File.separator + path + File.separator + File.separator;
            boolean uploadResult = FileManagerFactory.createFileManager().upload(localDirName, destPath);
            if (uploadResult) 
            {
                //Create OnBoarding Request 
                //--------------------------
                OnBoradingRequest oOnboradingRequest = new OnBoradingRequest();
                oOnboradingRequest.setCsarId(packageId);
                oOnboradingRequest.setPackageName(fileName);
                oOnboradingRequest.setPackagePath(localDirName);
                
                //Upload the Package to CATALOUGE and get CSARID
                //---------------------------------------------
                String catalougeCsarId = LifecycleTestExceutor.uploadPackageToCatalouge(oOnboradingRequest);
                if((null == catalougeCsarId) || catalougeCsarId.isEmpty())
                {
                    LOG.error("Failed to Upload Package to catalougeCsarId " + ToolUtil.objectToString(basicInfo));
                    return Response.status(Status.INTERNAL_SERVER_ERROR).build();
                }
                oOnboradingRequest.setCsarIdCatalouge(catalougeCsarId);
                LOG.info("catalougeCsarId :" + catalougeCsarId);

                
                //Update Default download count to -1
                packageData.setCsarId(packageId);
                packageData.setDownloadCount(-1);
                PackageData packateDbData = PackageManager.getInstance().addPackage(packageData);

                LOG.info("Store package data to database succed ! packateDbData = "  + ToolUtil.objectToString(packateDbData));
                LOG.info("upload package file end, fileName:" + fileName);

                result.setCsarId(packateDbData.getCsarId());

                //Assign  OnBoarding Request to OnBoarding Handler
                //------------------------------------------------
                addOnBoardingRequest(oOnboradingRequest);

                LOG.info("OnboradingRequest Data : "  + ToolUtil.objectToString(oOnboradingRequest));
            }
        }
        return Response.ok(ToolUtil.objectToString(result), MediaType.APPLICATION_JSON).build();
    }

    /**
     * Execute OnBarding request
     * @param oOnboradingRequest
     */
    private void addOnBoardingRequest(final OnBoradingRequest oOnboradingRequest) 
    {
        ExecutorService es = Executors.newFixedThreadPool(CommonConstant.ONBOARDING_THREAD_COUNT);
        es.submit(new Callable<Integer>()
        {
            public Integer call() throws Exception 
            {
                new OnBoardingHandler().handleOnBoardingReq(oOnboradingRequest);
                return CommonConstant.SUCESS;
            }
        });
    }

    /**
     * delete package by package id.
     * @param csarId package id
     * @return Response
     */
    public Response delPackage(String csarId) {
        LOG.info("delete package  info.csarId:" + csarId);
        if (ToolUtil.isEmptyString(csarId)) {
            LOG.error("delete package  fail, csarid is null");
            return Response.serverError().build();
        }
        deletePackageDataById(csarId);
        return Response.ok().build();
    }

    /**
     * Delete Package by CSAR ID
     * @param csarId
     */
    private void  deletePackageDataById(String csarId) {
        String packagePath = PackageWrapperUtil.getPackagePath(csarId);
        if (packagePath == null) {
            LOG.error("package path is null! ");
        }
        
        //Delete Package
        FileManagerFactory.createFileManager().delete(packagePath);
        //Delete Results Data
        FileManagerFactory.createFileManager().delete(File.separator + csarId);

        
        //delete package data from database
        try {
            PackageManager.getInstance().deletePackage(csarId);
        } catch (MarketplaceResourceException e1) {
            LOG.error("delete package  by csarId from db error ! " + e1.getMessage(), e1);
        }
    }

    /**
     * download package by package id.
     * @param csarId package id
     * @return Response
     */
    public Response downloadCsarPackagesById(String csarId) {
        PackageData packageData = PackageWrapperUtil.getPackageInfoById(csarId);
        
        String packageName = packageData.getName();
        String path = org.openo.vnfsdk.marketplace.filemanage.http.ToolUtil.getHttpServerAbsolutePath() +File.separatorChar+packageData.getType()+File.separatorChar+
                packageData.getProvider()+File.separatorChar+ packageData.getCsarId() +File.separator +packageName+File.separatorChar+packageData.getVersion() 
                +File.separator + packageName + ".csar";
        
        LOG.info("downloadCsarPackagesById path is :  " + path);
        
        File csarFile = new File(path);
        if (!csarFile.exists()) {
            return Response.status(Status.INTERNAL_SERVER_ERROR).build();
        }

        LOG.info("downloadCsarPackagesById ABS path is :  " + csarFile.getAbsolutePath());
        
        try 
        {
            InputStream fis = new BufferedInputStream(new FileInputStream(csarFile.getAbsolutePath()));
            return Response.ok(fis)
                    .header("Content-Disposition", "attachment; filename=\"" + csarFile.getName() + "\"")
                    .build();
        } 
        catch (Exception e1) 
        {
            LOG.error("download vnf package fail.", e1);
            return RestUtil.getRestException(e1.getMessage());
        }
    }

    /**
     * get package file uri.
     * @param csarId package id
     * @param relativePath file relative path
     * @return Response
     */
    public Response getCsarFileUri(String csarId) {
        return downloadCsarPackagesById(csarId);
    }

    /**
     * Interface to Update Download count for CSAR ID
     * @param csarId
     * @return
     */
    public Response updateDwonloadCount(String csarId) {
        return handleDownladCountUpdate(csarId) ?  
                Response.ok().build() : 
                    Response.status(Status.EXPECTATION_FAILED).build();
    }

    /**
     * Handle downlowa count update
     * @param csarId
     * @return
     */
    private boolean handleDownladCountUpdate(String csarId) {
        boolean bupdateSucess = false;
        try 
        {
            PackageManager.getInstance().updateDwonloadCount(csarId);
            bupdateSucess = true;
        } 
        catch (Exception exp) 
        {
            LOG.error("Updating Donwload count failed for Package with ID !!! : " + exp.getMessage(), exp);
        }
        return bupdateSucess;
    }

    /**
     * Interface to Re upload Package 
     * @param csarId
     * @param uploadedInputStream
     * @param fileDetail
     * @param details
     * @param head
     * @return
     * @throws Exception
     */
    public Response reUploadPackage(String csarId,
            InputStream uploadedInputStream, 
            FormDataContentDisposition fileDetail,
            String details, 
            HttpHeaders head) throws Exception
    {
        LOG.info("Reupload request Received !!!!");
        
        //STEP 1: Validate Input Data  
        //----------------------------
        boolean bResult = handleDataValidate(csarId,uploadedInputStream,fileDetail);
        if(!bResult)
        {
            LOG.error("Validation of Input received for Package Upload failed during Reload!!!");
            return Response.status(Status.EXPECTATION_FAILED).build();
        }

        //STEP 2: Delete All Package Data based on package id
        //----------------------------------------------------
        deletePackageDataById(csarId);

        //STEP 3: upload package with same package id
        //-------------------------------------------
        return handlePackageUpload(csarId,uploadedInputStream, fileDetail, details, head);
    }

    /**
     * Interface to get OnBoarding Result by Operation Type
     * @param csarId
     * @param operTypeId
     * @param operId
     * @return
     */
    public Response getOnBoardingResult(String csarId, String operTypeId, String operId)
    {
        LOG.info("getOnBoardingResult request : csarId:" + csarId + " operTypeId:" + operTypeId + " operId:" + operId);
        if ((null == csarId) || (null == operTypeId) || (null == operId)) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        if ((csarId.isEmpty()) || (operTypeId.isEmpty()) || (operId.isEmpty())) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        PackageData packageData = PackageWrapperUtil.getPackageInfoById(csarId);
        if (null == packageData) {
            return Response.status(Response.Status.PRECONDITION_FAILED).build();
        }
        
        handleDelayExec(operId);
        
        OnBoardingResult oOnBoardingResult = FunctionTestHook.getOnBoardingResult(packageData);
        if (null == oOnBoardingResult) {
            return Response.status(Response.Status.PRECONDITION_FAILED).build();
        }
        filterOnBoardingResultByOperId(oOnBoardingResult, operId);

        String strResult = ToolUtil.objectToString(oOnBoardingResult);
        LOG.info("getOnBoardingResult response : " + strResult);
        return Response.ok(strResult, "application/json").build();
    }

    
    private void filterOnBoardingResultByOperId(OnBoardingResult oOnBoardingResult, String operId)
    {
        if (0 == operId.compareToIgnoreCase("all")) {
            return;
        }
        if (0 == operId.compareToIgnoreCase("download"))
        {
            List<OnBoardingOperResult> operResultListTemp = new ArrayList<OnBoardingOperResult>();
            OnBoardingOperResult operResultListTmp = new OnBoardingOperResult();
            operResultListTmp.setOperId("download");
            operResultListTmp.setStatus(0);
            operResultListTemp.add(operResultListTmp);
            oOnBoardingResult.setOperResult(operResultListTemp);
            return;
        }
        List<OnBoardingOperResult> operResultListOut = new ArrayList<OnBoardingOperResult>();
        List<OnBoardingOperResult> operResultList = oOnBoardingResult.getOperResult();
        for (OnBoardingOperResult operResult : operResultList) {
            if (0 == operResult.getOperId().compareToIgnoreCase(operId)) {
                operResultListOut.add(operResult);
            }
        }
        oOnBoardingResult.setOperResult(operResultListOut);
    }

    /**
     * Interface to get OnBoarding Status by Operation ID
     * @param csarId
     * @param operTypeId
     * @return
     */
    public Response getOperResultByOperTypeId(String csarId, String operTypeId) 
    {
        LOG.error("getOnBoardingResult request : csarId:"+ csarId + " operTypeId:"+operTypeId);    
        if(null == csarId || null == operTypeId || csarId.isEmpty()  || operTypeId.isEmpty())
        {
            return Response.status(Status.BAD_REQUEST).build(); 
        }

        PackageData packageData = PackageWrapperUtil.getPackageInfoById(csarId);
        if(null == packageData)
        {
            LOG.error("Failed to find package for PackageID:"+ csarId); 
            return Response.status(Status.PRECONDITION_FAILED).build(); 
        } 

        //Get result key to fetch Function Test Results
        //---------------------------------------------
        String strResult = FunctionTestHook.getFuncTestResults(packageData);
        if(null == strResult)
        {
            LOG.error("NULL reponse for getOperResultByOperTypeId response :"+ strResult); 
            return Response.status(Status.INTERNAL_SERVER_ERROR).build(); 
        }   
        LOG.info("getOperResultByOperTypeId response :"+ strResult);    
        return Response.ok(strResult, MediaType.APPLICATION_JSON).build();
    }

    private boolean handleDataValidate(String packageId,InputStream uploadedInputStream, FormDataContentDisposition fileDetail) 
    {
        boolean bvalidateOk = false;
        if ((null != uploadedInputStream) && (fileDetail != null) && !ToolUtil.isEmptyString(packageId)) 
        {
            bvalidateOk = true;
        }
        return bvalidateOk;
    }

    /**
     * Interface to get OnBoarding Steps
     * @return
     */
    public Response getOnBoardingSteps()
    {
        LOG.info("Get OnBoarding Steps request Received !!!");

        String filePath = org.openo.vnfsdk.marketplace.filemanage.http.ToolUtil.getAppDeployPath() + File.separator +"generalconfig/OnBoardingSteps.json";            
        LOG.info("Onboarding Steps Json file Path  :" + filePath);

        OnBoardingSteps oOnBoardingSteps = (OnBoardingSteps)FileUtil.readJsonDatafFromFile(filePath, OnBoardingSteps.class);
        if (null == oOnBoardingSteps) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }
        String strResult = ToolUtil.objectToString(oOnBoardingSteps);
        LOG.info("getOnBoardingSteps response :" + strResult);
        return Response.ok(strResult, MediaType.APPLICATION_JSON).build();
    }
    
    private void handleDelayExec(String operId) 
    {
        if (0 == operId.compareToIgnoreCase(CommonConstant.functionTest.FUNCTEST_EXEC)) 
        {
            try 
            {
                Thread.sleep(8000);
            } 
            catch (InterruptedException e) 
            {
                LOG.info("handleDelayExex response : " + e.getMessage());
            }
        }
    }
}
