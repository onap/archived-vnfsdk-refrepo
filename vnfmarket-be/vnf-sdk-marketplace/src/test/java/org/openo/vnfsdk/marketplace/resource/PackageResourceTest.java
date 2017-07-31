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

package org.openo.vnfsdk.marketplace.resource;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.ws.rs.core.Response;

import org.codehaus.jackson.JsonNode;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.junit.Before;
import org.junit.Test;
import org.openo.vnfsdk.marketplace.common.FileUtil;
import org.openo.vnfsdk.marketplace.common.JsonUtil;
import org.openo.vnfsdk.marketplace.common.ToolUtil;
import org.openo.vnfsdk.marketplace.db.connection.ConnectionUtil;
import org.openo.vnfsdk.marketplace.db.entity.PackageData;
import org.openo.vnfsdk.marketplace.db.impl.MarketplaceDaoImpl;
import org.openo.vnfsdk.marketplace.db.resource.PackageManager;
import org.openo.vnfsdk.marketplace.db.util.MarketplaceDbUtil;
import org.openo.vnfsdk.marketplace.db.wrapper.PackageHandler;
import org.openo.vnfsdk.marketplace.entity.CsarPackage;
import org.openo.vnfsdk.marketplace.entity.EnumOperationalState;
import org.openo.vnfsdk.marketplace.entity.EnumType;
import org.openo.vnfsdk.marketplace.entity.EnumUsageState;
import org.openo.vnfsdk.marketplace.entity.VnfPackage;
import org.openo.vnfsdk.marketplace.entity.request.PackageBasicInfo;
import org.openo.vnfsdk.marketplace.entity.response.CsarFileUriResponse;
import org.openo.vnfsdk.marketplace.entity.response.PackageMeta;
import org.openo.vnfsdk.marketplace.entity.response.PackageResponse;
import org.openo.vnfsdk.marketplace.filemanage.http.HttpFileManagerImpl;
import org.openo.vnfsdk.marketplace.onboarding.entity.OnBoardingResult;
import org.openo.vnfsdk.marketplace.onboarding.entity.OnBoradingRequest;
import org.openo.vnfsdk.marketplace.onboarding.entity.ResultKey;
import org.openo.vnfsdk.marketplace.onboarding.hooks.functiontest.FunctionTestExceutor;
import org.openo.vnfsdk.marketplace.onboarding.hooks.functiontest.FunctionTestHook;
import org.openo.vnfsdk.marketplace.rest.RestResponse;
import org.openo.vnfsdk.marketplace.rest.RestfulClient;
import org.openo.vnfsdk.marketplace.wrapper.PackageWrapper;
import org.openo.vnfsdk.marketplace.wrapper.PackageWrapperUtil;

import mockit.MockUp;
import mockit.Mock;

public class PackageResourceTest {

    private PackageResource packageResource = null;
    private Response response = null;
    private String csarID =  "csarid";
    private List<PackageData> packageDataList = null;
    private PackageData packageData = null;
    private FormDataContentDisposition fileDetail = null;
    private InputStream inputStream = null;
    private String operTypeId = "opertype";
    private VnfPackage vnfPackageObj = null;
    private CsarPackage csarPackageObj = null;
    private PackageBasicInfo pkgBasicInfoObj = null;
    private PackageMeta pkgMetaObj = null;
    private PackageResponse pkgResponseObj = null;
    private CsarFileUriResponse csarFileUriResObj = null;
    @Before
    public void setUp() {
        packageResource = new PackageResource();
        vnfPackageObj = new VnfPackage();
        csarPackageObj = new CsarPackage();
        pkgBasicInfoObj = new PackageBasicInfo();
        pkgMetaObj = new PackageMeta();
        pkgResponseObj = new PackageResponse();
        csarFileUriResObj = new CsarFileUriResponse();
    }

    @Before
    public void createTestFile()
    {
        String filePath = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "Test.txt";
        File file = new File(filePath);
        try {
            file.createNewFile();
            FileWriter writer = new FileWriter(file);
            writer.write("This is test file.");
            writer.close();
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        
        filePath = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "testfolder";
        file = new File(filePath);
        if(!file.exists()) {
            file.mkdirs();
        }

        StringBuilder sb = new StringBuilder();
        sb.append("test data");
        
        filePath = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "temp.zip";
        file = new File(filePath);
        try {
            ZipOutputStream out = new ZipOutputStream(new FileOutputStream(file));
            ZipEntry e = new ZipEntry("temp.txt");
            out.putNextEntry(e);
            byte[] data = sb.toString().getBytes();
            out.write(data, 0, data.length);
            out.closeEntry();
            out.close();
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }
    }

    @Test
    public void testQueryPackageListByCond() throws Exception{
        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public List<PackageData> getAllPackageData() {              
                return new ArrayList<PackageData>();            
            }
        };
        try {
            response = PackageWrapper.getInstance().queryPackageListByCond( null, null, null, null, null);
        } catch( Exception e ) {
            e.printStackTrace();
        }      

        assertNotNull( response );
        assertEquals( 200, response.getStatus());
        //assertNull(res5);
        // assertEquals(00,res5.getStatus());
    }

    @Test
    public void testQueryPackageById() throws Exception {
        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public List<PackageData> getPackageData(String csarId) {
                return null;
            }

        }; 
        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public List<PackageData> getPackageData( String csarId ) {  
                packageDataList = new ArrayList<PackageData>();   
                packageData = new PackageData();
                packageData.setCsarId( csarId );
                packageData.setDownloadUri( "src\\test\\resources\\clearwater_ns.csar" );
                packageData.setName( "clearwater_ns.csar" );
                packageData.setSize( "59,854  bytes" );
                packageData.setVersion( "v1.0" );
                packageData.setProvider( "Huawei" );
                packageDataList.add( packageData );
                return packageDataList;             
            }
        }; 

        try {
            response = PackageWrapper.getInstance().queryPackageById( csarID );
        } catch ( Exception e ) {
            e.printStackTrace();
        }
        assertNotNull( response );
        assertEquals( 200, response.getStatus());           
    }   

    @Test
    public void testDelPackageFaiure() {
        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public List<PackageData> getAllPackageData() { 
                return new ArrayList<PackageData>(); 
            }
        };

        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public void deletePackageData( String csarId ) {            
                return;             
            }
        };

        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public List<PackageData> getPackageData( String csarId ) {              
                return new ArrayList<PackageData>();            
            }
        };       

        try {
            response = PackageWrapper.getInstance().delPackage( "" );
        } catch ( Exception e5 ) {
            e5.printStackTrace();
        }       
        assertEquals( 500, response.getStatus());

        try {
            response = PackageWrapper.getInstance().delPackage( null );
        } catch ( Exception e5 ) {
            e5.printStackTrace();
        } 
        assertEquals( 500, response.getStatus());        
    }

    @Test
    public void testDelPackageSuccess() {
        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public List<PackageData> getAllPackageData() { 
                packageDataList = new ArrayList<PackageData>();   
                packageData = new PackageData();
                packageData.setCsarId( csarID );
                packageData.setDownloadUri( "src\\test\\resources\\clearwater_ns.csar" );
                packageData.setName( "clearwater_ns.csar" );
                packageData.setSize( "59,854  bytes" );
                packageData.setVersion( "v1.0" );
                packageData.setProvider( "Huawei" );
                packageDataList.add( packageData );
                return packageDataList;             
            }
        };

        new MockUp<PackageManager>() {
            @Mock
            public void deletePackage( String csarId ) {            
                return;             
            }
        };

        new MockUp<HttpFileManagerImpl>() {
            @Mock
            public boolean delete( String srcPath ) {           
                return true;            
            }
        };

        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public List<PackageData> getPackageData( String csarId ) {              
                packageDataList = new ArrayList<PackageData>();   
                packageData = new PackageData();
                packageData.setCsarId( csarID );
                packageData.setDownloadUri( "src\\test\\resources\\" );
                packageData.setName( "clearwater_ns.csar" );
                packageData.setSize( "59,854  bytes" );
                packageData.setVersion( "v1.0" );
                packageData.setProvider( "Huawei" );
                packageDataList.add( packageData );
                return packageDataList;             
            }
        };        

        try {
            response = PackageWrapper.getInstance().delPackage( "csarid" );
        } catch ( Exception e ) {
            e.printStackTrace();
        }   

        assertNotNull( response );
        assertEquals( 200, response.getStatus());             
    }

    @Test
    public void testGetCsarFileUri() {      
        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public List<PackageData> getPackageData( String csarId ) {  
                packageDataList = new ArrayList<PackageData>();   
                packageData = new PackageData();
                packageData.setCsarId( csarId );
                packageData.setDownloadUri( "src\\test\\resources\\" );
                packageData.setName( "clearwater_ns.csar" );
                packageData.setSize( "59,854  bytes" );
                packageData.setVersion( "v1.0" );
                packageData.setProvider( "Huawei" );
                packageDataList.add( packageData );
                return packageDataList;             
            }
        }; 

        new MockUp<PackageWrapper>() {      
            @Mock
            Response downloadCsarPackagesById(String csarId) throws FileNotFoundException
            {                
                String fileName="src" + File.separator + "test" + File.separator + "resources" + File.separator + "Test.txt";
                InputStream fis = new BufferedInputStream(new FileInputStream(fileName));
                return Response.ok(fis).header("Content-Disposition", "attachment; filename=\"" + fileName + "\"").build();
            }   
        }; 
        response = PackageWrapper.getInstance().getCsarFileUri("csarId");
        assertEquals( 200, response.getStatus() );      

    } 

    @Test    
    public void testupdateDwonloadCountSuccess() throws Exception
    {
        final List<PackageData> pkgList = new ArrayList<PackageData>();
        PackageData pkgDataObj = new PackageData();
        pkgDataObj.setDownloadCount( 1 );
        pkgList.add(pkgDataObj);
        new  MockUp<MarketplaceDaoImpl>() {
            @Mock
            public List<PackageData> getPackageData(String csarId) {                
                return pkgList;
                //return new ArrayList<PackageData>();
            }
        };
        new  MockUp<MarketplaceDaoImpl>() {
            @Mock
            public void updatePackageData(PackageData oPackageData){                
                return ;

            }
        };
        try {
            response = PackageWrapper.getInstance().updateDwonloadCount( csarID );
        } catch ( Exception e5 ) {
            e5.printStackTrace();
        }
        assertNotNull( response );
        assertEquals( 200,response.getStatus() );
    }

    @Test
    public void testReUploadPackage() {
        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public List<PackageData> getPackageData( String csarId ) {   
                List<PackageData> packageDataList = new ArrayList<PackageData>();
                PackageData packageData = new PackageData();
                packageData = new PackageData();
                packageData.setCsarId( csarId );
                packageData.setDownloadUri( "src\\test\\resources\\clearwater_ns.csar" );
                packageData.setName( "clearwater_ns.csar" );
                packageData.setSize( "59,854  bytes" );
                packageData.setVersion( "v1.0" );
                packageData.setProvider( "Huawei" );
                packageDataList.add( packageData );
                return packageDataList;                         
            }           
        }; 

        new MockUp<HttpFileManagerImpl>() {
            @Mock
            public boolean delete(String srcPath) {
                return true;
            }
        };        

        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public void deletePackageData(String csarId) {
                return;
            }
        };

        new MockUp<ToolUtil>() {
            @Mock
            public String getTempDir(String dirName, String fileName) {
                String fileN = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "testfolder";
                return fileN;
            }
        };

        new MockUp<HttpFileManagerImpl>() {
            @Mock
            public boolean upload(String srcPath, String dstPath) {
                return true;
            }
        };

        new MockUp<PackageWrapperUtil>() {
            @Mock
            public PackageData getPackageData(PackageMeta meta) {
                PackageData packageData = new PackageData();
                packageData.setCreateTime( "25-3-2017 15:26:00" );
                packageData.setDeletionPending( "deletion" );
                packageData.setDownloadUri( "downloaduri" );
                packageData.setFormat( "format" );
                packageData.setModifyTime( "time" );
                packageData.setName( "name" );
                packageData.setCsarId( "csarid" );
                packageData.setProvider( "huawei" );
                String fileSize = "10 mb";
                packageData.setSize(fileSize);
                packageData.setType( "type" );
                packageData.setVersion( "v2.0" );
                packageData.setDetails( "details" );
                packageData.setShortDesc( "description" );
                packageData.setRemarks( "remarks" );
                return packageData;
            }
        };

        new MockUp<PackageHandler>() {
            @Mock
            public PackageData create(PackageData packageData) {
                PackageData packageDataObj = new PackageData();
                packageDataObj.setCreateTime( "25-3-2017 15:26:00" );
                packageDataObj.setDeletionPending( "deletion" );
                packageDataObj.setDownloadUri( "downloaduri" );
                packageDataObj.setFormat( "format" );
                packageDataObj.setModifyTime( "modifytime" );
                packageDataObj.setName( "name" );
                packageDataObj.setCsarId( "csarid" );
                packageDataObj.setProvider( "huawei" );
                String fileSize = "10 mb";
                packageDataObj.setSize(fileSize);
                packageDataObj.setType( "type" );
                packageDataObj.setVersion( "v2.0" );
                packageDataObj.setDetails( "details" );
                packageDataObj.setShortDesc( "description" );
                packageDataObj.setRemarks( "remarks" );
                return packageDataObj;
            }
        };

        try {
            response = PackageWrapper.getInstance().reUploadPackage( null, null, null,null, null );
        } catch( Exception e ) {
            e.printStackTrace();
        }
        assertEquals( 417, response.getStatus() );

        try {
            fileDetail = FormDataContentDisposition.name( "fileName" ).fileName( "clearwater_ns.csar" ).build(); 
            String fileName = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "clearwater_ns.csar";
            inputStream = new FileInputStream(fileName);
            response = PackageWrapper.getInstance().reUploadPackage( "csarID", inputStream, fileDetail, null, null );
            //assertEquals( 200, response.getStatus() );
        } catch( Exception e ) {
            e.printStackTrace();
        }
    }   

    @Test
    public void testgetOperResultByOperTypeIdFailure() throws Exception
    {
        final ResultKey resultKeyObj = new ResultKey();

        new  MockUp<FunctionTestHook>() {
            @Mock
            ResultKey getFuncTestResultKey(PackageData packageData) {
                resultKeyObj.setKey("key");
                return resultKeyObj;
            }
        };
        new MockUp<FunctionTestExceutor>(){
            @Mock
            String getTestResultsByFuncTestKey(String key) 
            {           
                return null;
            }
        };  

        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public List<PackageData> getPackageData( String csarId ) {   
                List<PackageData> packageDataList = new ArrayList<PackageData>();
                PackageData packageData = new PackageData();
                packageData = new PackageData();
                packageData.setCsarId( csarId );
                packageData.setDownloadUri( "src\\test\\resources\\learwater_ns.csar" );
                packageData.setName( "clearwater_ns.csar" );
                packageData.setSize( "59,854  bytes" );
                packageData.setVersion( "v1.0" );
                packageData.setProvider( "Airtel" );
                packageDataList.add( packageData );
                return packageDataList;                         
            }           
        };


        try {
            response = PackageWrapper.getInstance().getOperResultByOperTypeId( csarID,operTypeId );
        } catch ( Exception e5 ) {
            e5.printStackTrace();
        }       
        assertEquals(500,response.getStatus());

        try {
            response = PackageWrapper.getInstance().getOperResultByOperTypeId( "", "" );
        } catch( Exception e ) {
            e.printStackTrace();
        }
        assertEquals( 400,response.getStatus() );
    }

    @Test
    public void testgetOperResultByOperTypeIdSuccess() {        
        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public List<PackageData> getPackageData( String csarId ) {   
                List<PackageData> packageDataList = new ArrayList<PackageData>();
                PackageData packageData = new PackageData();
                packageData = new PackageData();
                packageData.setCsarId( csarId );
                packageData.setDownloadUri( "src\\test\\resources\\learwater_ns.csar" );
                packageData.setName( "clearwater_ns.csar" );
                packageData.setSize( "59,854  bytes" );
                packageData.setVersion( "v1.0" );
                packageData.setProvider( "Airtel" );
                packageDataList.add( packageData );
                return packageDataList;                         
            }           
        }; 

        new MockUp<ToolUtil>() {
            @Mock
            public String getTempDir(String dirName, String fileName) {
                String filena = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "testfolder";
                return filena;
            }
        };
        new MockUp<PackageWrapper>() {     
            @Mock
            Response downloadCsarPackagesById(String csarId) throws FileNotFoundException
            {
                String fileName = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "Test.txt";
                InputStream fis = new BufferedInputStream(new FileInputStream(fileName));
                return Response.ok(fis).header("Content-Disposition", "attachment; filename=\"" + fileName + "\"").build();
            }   
        }; 

        new  MockUp<FunctionTestHook>() {
            @Mock
            ResultKey getFuncTestResultKey(PackageData packageData) {
                ResultKey resultKey = new ResultKey();
                resultKey.setKey( "key" );
                return resultKey;
            }
        };
        new MockUp<FunctionTestExceutor>(){
            @Mock
            String getTestResultsByFuncTestKey(String key) { 
                return "key";       
            }
        };

        try {
            response = PackageWrapper.getInstance().getOperResultByOperTypeId( csarID, operTypeId );                        
        } catch( Exception e ) {
            e.printStackTrace();
        }       
    }   

    //@Ignore
    @Test
    public void testUploadPackage() throws Exception {
        InputStream ins = null;
        Response result = null;
        /*Response result1 = null;
      Response result2 = null;
      PackageData packageData = new PackageData();
      packageData = getPackageData();*/

        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public List<PackageData> getPackageData( String csarId ) {   
                List<PackageData> packageDataList = new ArrayList<PackageData>();
                PackageData packageData = new PackageData();
                packageData = new PackageData();
                packageData.setCsarId( csarId );
                packageData.setDownloadUri( "src\\test\\resources\\" );
                packageData.setName( "clearwater_ns.csar" );
                packageData.setSize( "59,854  bytes" );
                packageData.setVersion( "v1.0" );
                packageData.setProvider( "Airtel" );
                packageDataList.add( packageData );
                return packageDataList;                         
            }           
        }; 

        new MockUp<HttpFileManagerImpl>() {
            @Mock
            public boolean delete(String srcPath) {
                return true;
            }
        };        

        new MockUp<MarketplaceDaoImpl>() {
            @Mock
            public void deletePackageData(String csarId) {
                return;
            }
        };

        new MockUp<ToolUtil>() {
            @Mock
            public String getTempDir(String dirName, String fileName) {
                String filena = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "testfolder";
                return filena;
            }
        };

        new MockUp<HttpFileManagerImpl>() {
            @Mock
            public boolean upload(String srcPath, String dstPath) {
                return false;
            }
        };

        new MockUp<PackageWrapperUtil>() {
            @Mock
            public PackageData getPackageData(PackageMeta meta) {
                PackageData packageData = new PackageData();
                packageData.setCreateTime( "25-3-2017 15:26:00" );
                packageData.setDeletionPending( "deletion" );
                packageData.setDownloadUri( "downloaduri" );
                packageData.setFormat( "format" );
                packageData.setModifyTime( "time" );
                packageData.setName( "name" );
                packageData.setCsarId( "csarid" );
                packageData.setProvider( "huawei" );
                String fileSize = "10 mb";
                packageData.setSize(fileSize);
                packageData.setType( "type" );
                packageData.setVersion( "v2.0" );
                packageData.setDetails( "details" );
                packageData.setShortDesc( "description" );
                packageData.setRemarks( "remarks" );
                return packageData;
            }
        };

        new MockUp<PackageHandler>() {
            @Mock
            public PackageData create(PackageData packageData) {
                PackageData packageDataObj = new PackageData();
                packageDataObj.setCreateTime( "25-3-2017 15:26:00" );
                packageDataObj.setDeletionPending( "deletion" );
                packageDataObj.setDownloadUri( "downloaduri" );
                packageDataObj.setFormat( "format" );
                packageDataObj.setModifyTime( "modifytime" );
                packageDataObj.setName( "name" );
                packageDataObj.setCsarId( "csarid" );
                packageDataObj.setProvider( "huawei" );
                String fileSize = "10 mb";
                packageDataObj.setSize(fileSize);
                packageDataObj.setType( "type" );
                packageDataObj.setVersion( "v2.0" );
                packageDataObj.setDetails( "details" );
                packageDataObj.setShortDesc( "description" );
                packageDataObj.setRemarks( "remarks" );
                return packageDataObj;
            }
        };


        FormDataContentDisposition fileDetail =
                FormDataContentDisposition.name("fileName").fileName("clearwater_ns.csar").build();

        String filenama = "src" + File.separator + "test" + File.separator + "resources" + File.separator + "clearwater_ns.csar";
        File packageFile = new File(filenama);


        try {
            ins = new FileInputStream(packageFile);
        } catch (FileNotFoundException e2) {
            e2.printStackTrace();
        }
        if (ins != null) {
            try {
                result = PackageWrapper.getInstance().uploadPackage(ins, fileDetail, null,null);
            } catch (Exception e3) {
                e3.printStackTrace();
            }
        }

        assertNotNull( result );
        assertEquals( 200, result.getStatus() );

        try {
            result = PackageWrapper.getInstance().uploadPackage(null, null, null,null);
        } catch (Exception e4) {
            e4.printStackTrace();
        }

        assertEquals(417, result.getStatus());}


    @Test
    public void testGetOnBoardingStepsSuccess() {       
        new MockUp<org.openo.vnfsdk.marketplace.filemanage.http.ToolUtil>() {
            @Mock
            String getAppDeployPath() {
                String path = "src" + File.separator + "main" + File.separator + "resources";
                return path;
            }
        };     

        try {
            response = PackageWrapper.getInstance().getOnBoardingSteps();
        } catch( Exception e ) {
            e.printStackTrace();
        }

        assertNotNull( response );
    }

    @Test
    public void testGetOnBoardingStepsFailure() {       
        new MockUp<org.openo.vnfsdk.marketplace.filemanage.http.ToolUtil>() {
            @Mock
            String getAppDeployPath() {
                String path = "src" + File.separator + "main" + File.separator + "resources"+ File.separator + "generalconfig";               
                return path;
            }
        };     

        try {
            response = PackageWrapper.getInstance().getOnBoardingSteps();
        } catch( Exception e ) {
            e.printStackTrace();
        }           
        assertEquals( 500, response.getStatus() );
    }

    @Test     
    public void testRestGetClient() {
        FunctionTestExceutor.getTestResultsByFuncTestKey("GET");


    }

    @Test
    public void testRestPostClient() {

        OnBoradingRequest onBoradFuncTestReq = new OnBoradingRequest();
        onBoradFuncTestReq.setPackagePath("src/test/resources/clearwater_ns.csar");
        onBoradFuncTestReq.setPackageName("clearwater_ns.csar");
        String result =     FunctionTestExceutor.execFunctionTest( onBoradFuncTestReq);
        assertNull(result);
        //assertEquals(200,result);

    }

    @Test
    public void testRestDeleteClient() {
        RestResponse rsp = RestfulClient.delete("127.0.0.1",8987,"TestURL");
        assertNotNull(rsp);
        if(rsp.getStatusCode() != null)
            assertEquals(200,rsp.getStatusCode().intValue());

    }

    @Test
    public void testExec() {

        new  MockUp<FunctionTestHook>() {
            @Mock
            String getResultStorePath(){                   
                return "src/test/resources";

            }
        };
        FunctionTestHook testHookObj = new FunctionTestHook();
        OnBoradingRequest onBoradFuncTestReq = new OnBoradingRequest();
        onBoradFuncTestReq.setPackagePath("src/test/resources/clearwater_ns.csar");
        int res=testHookObj.exec(onBoradFuncTestReq);

        assertEquals(res,-1);
    }

    @Test

    public void testwriteJsonDatatoFile(){

        String filePath="src//test//resources//functionTest.json";
        OnBoardingResult onBoardResultObj = new OnBoardingResult();
        onBoardResultObj.setCsarId("csrId");
        onBoardResultObj.setOperStatus(1);
        boolean res = FileUtil.writeJsonDatatoFile(filePath,onBoardResultObj);
        assertEquals(res,true);

    }

    @Test

    public void testCreateDirectory()
    {
        String dirPath = "src//test//resources//TestDirectory";
        boolean res = FileUtil.createDirectory(dirPath);
        assertEquals(res,true);
    }

    @Test

    public void testDeleteDirectory()
    {
        String dirPath = "src//test//resources//TestDirectory";
        boolean res = FileUtil.deleteFile(dirPath);
        assertEquals(res,true);
    }

    @Test

    public void testGenerateId()
    {
        String id= MarketplaceDbUtil.generateId();
        assertNotNull(id);
    }

    @Test
    public void testisNotEmpty()
    {
        boolean res = MarketplaceDbUtil.isNotEmpty(null);
        assertEquals(res,false);
        res = MarketplaceDbUtil.isNotEmpty("test");
        assertEquals(res,true);
    }

    @Test
    public void testobjectToString()
    {
        Object obj="testexa";
        String res = MarketplaceDbUtil.objectToString(obj);
        assertNotNull(res);
        res = MarketplaceDbUtil.objectToString(null);
        assertNull(res);
    }
    @Test
    public void testisEmptyString()
    {
        boolean res = ToolUtil.isEmptyString(null);
        assertEquals(res,true);
        res = ToolUtil.isEmptyString("huawei");
        assertEquals(res,false);
    }

    @Test
    public void testisTrimedEmptyString()
    {
        boolean res = ToolUtil.isTrimedEmptyString(null);
        assertEquals(res,true);
        res = ToolUtil.isTrimedEmptyString("    ");
        assertEquals(res,true);
    }

    @Test
    public void testisEmptyCollection() {

        boolean res = ToolUtil.isEmptyCollection(new ArrayList());
        assertEquals(res,true);
    }

    @Test
    public void testisYamlFile()
    {
        File fileObj = new File("test.txt");
        boolean res = ToolUtil.isYamlFile(fileObj);
        assertEquals(res,false);
    }

    @Test
    public void testgenerateID()
    {
        String id= ToolUtil.generateId();
        assertNotNull(id);
    }
    @Test
    public void testgetFormatFileSize()
    {
        String res = ToolUtil.getFormatFileSize(10000000);
        assertNotNull(res);
        res = ToolUtil.getFormatFileSize(10000);
        assertNotNull(res);
        res = ToolUtil.getFormatFileSize(100);
        assertNotNull(res);
    }

    @Test
    public void testObjectToString()
    {
        Object obj="testexa";
        String res = ToolUtil.objectToString(obj);
        assertNotNull(res);
        res = ToolUtil.objectToString(null);
        assertNotNull(res);
    }

    @Test
    public void testprocessFileName()
    {
        String res = ToolUtil.processFileName("abc.txt");
        assertNotNull(res);
        res = ToolUtil.processFileName("abc.zip");
        assertNotNull(res);
    }
    @Test
    public void testremoveCsarSuffix()
    {
        String res = ToolUtil.removeCsarSuffix("abc.csar");
        assertEquals(res,"abc");
    }
    @Test
    public void testformatCsar()
    {
        String res = ToolUtil.formatCsar("abc");
        assertEquals(res,"abc.csar");
    }
    @Test
    public void testformatFileSize()
    {
        String res = ToolUtil.formatFileSize(10000.0,10);
        assertEquals(res,"1000.00M");
    }

    @Test
    public void testgetFileSize()
    {
        File fileObj = new File("example.txt");
        String res = ToolUtil.getFileSize(fileObj,10);
        assertNotNull(res);
    }

    @Test
    public void testgetCataloguePath()
    {
        String res = ToolUtil.getCataloguePath();
        assertEquals(res,"");
    }

    @Test
    public void testgetCatalogueCsarPath()
    {
        String res = ToolUtil.getCatalogueCsarPath();
        assertEquals(res,File.separator + "csar");
    }

    @Test
    public void testgetCatalogueImagePath()
    {
        String res = ToolUtil.getCatalogueImagePath();
        assertEquals(res,File.separator + "image");
    }

    @Test
    public void testdeleteFile()
    {
        boolean res = ToolUtil.deleteFile("src//test//resources", "test1.txt");
        assertEquals(res,true);
    }

    @Test
    public void teststoreChunkFileInLocal()
    { 
        try {
            inputStream = new FileInputStream("src//test//resources//Test.txt");
            String res = ToolUtil.storeChunkFileInLocal("src//test//resources","TestOut.txt",inputStream);
            File file = new File(res);
            String fileName = file.getName();
            assertEquals(fileName,"TestOut.txt");

        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
    }
    @Test
    public void testToolUtildeleteFile()
    {
        boolean res = ToolUtil.deleteFile("src/test/resources","TestOut.txt");
        assertEquals(res,true);
    }

    @Test
    public void testGetSession() {
        try {
            assertNotNull( ConnectionUtil.getSession() );
        } catch( Exception e ) {
            e.printStackTrace();
        }
    }

    @Test
    public void testToJson() {
        List<String> listObj = new ArrayList<String>();
        listObj.add("test");
        String res = JsonUtil.toJson(listObj);
        assertNotNull(res);
    }

    @Test
    public void testfromJson() {

        String carJson = "{ \"brand\" : \"Mercedes\", \"doors\" : 5 }";
        JsonNode res = JsonUtil.fromJson(carJson,JsonNode.class);
        assertNotNull(res);
    }

    @Test
    public void testUnzip() {

        List<String> listObj = new ArrayList<String>();
        try {
            listObj=FileUtil.unzip("src/test/resources/temp.zip", "src/test/resources/testfolder");
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
        assertNotNull(listObj);
    }

    @Test
    public void testreadJsonDatafFromFile() {

        Object obj = FileUtil.readJsonDatafFromFile("src/main/resources/generalconfig/OnBoardingSteps.json",Object.class);
        assertNotNull(obj);
    }

    @Test
    public void testGetPkgSize() {
        long pkgSize = PackageWrapperUtil.getPacakgeSize("src/test/resources/Test.txt");
        assertNotNull(pkgSize);
    }

    @Test
    public void testPkgFormat() {
        assertNotNull(PackageWrapperUtil.getPackageFormat("xml"));
        assertNotNull(PackageWrapperUtil.getPackageFormat("yml"));
        assertNull(PackageWrapperUtil.getPackageFormat("pdf"));

    }
    @Test
    public void testVnfPackageSetter() {

        vnfPackageObj.setVnfPackageId("vnfpackageId");
        vnfPackageObj.setVnfPackageUrl("vnfPackageUrl");
        vnfPackageObj.setVnfd("vnfd");
        vnfPackageObj.setVersion("1");
        vnfPackageObj.setUsageState(EnumUsageState.NotInUse);
        vnfPackageObj.setProvider("huawei");
        vnfPackageObj.setOperationalState(EnumOperationalState.Enabled);
        vnfPackageObj.setName("vnf");
        vnfPackageObj.setDeletionPending("pending");

        String res = vnfPackageObj.getVnfPackageId();
        assertEquals(res,"vnfpackageId");
        res = vnfPackageObj.getVnfPackageUrl();
        assertEquals(res,"vnfPackageUrl");
        res = vnfPackageObj.getVnfd();
        assertEquals(res,"vnfd");
        res = vnfPackageObj.getVersion();
        assertEquals(res,"1");
        EnumUsageState state = vnfPackageObj.getUsageState();
        assertEquals(state,EnumUsageState.NotInUse);
        res = vnfPackageObj.getProvider();
        assertEquals(res,"huawei");
        EnumOperationalState operState = vnfPackageObj.getOperationalState();
        assertEquals(operState,EnumOperationalState.Enabled);
        res = vnfPackageObj.getName();
        assertEquals(res,"vnf");
        res = vnfPackageObj.getDeletionPending();
        assertEquals(res,"pending");
    }

    @Test
    public void testCsarPackageSetter() {
        csarPackageObj.setCreateTime("04052017");
        csarPackageObj.setDeletionPending("pending");
        csarPackageObj.setFormat("format");
        csarPackageObj.setId("12");
        csarPackageObj.setName("csartest");
        csarPackageObj.setSize("10");
        csarPackageObj.setStatus("done");
        csarPackageObj.setType("type");
        csarPackageObj.setUrl("//network");

        String res = csarPackageObj.getCreateTime();
        assertEquals(res,"04052017");
        res = csarPackageObj.getDeletionPending();
        assertEquals(res,"pending");
        res = csarPackageObj.getFormat();
        assertEquals(res,"format");
        res = csarPackageObj.getId();
        assertEquals(res,"12");
        res = csarPackageObj.getName();
        assertEquals(res,"csartest");
        res = csarPackageObj.getSize();
        assertEquals(res,"10");
        res = csarPackageObj.getStatus();
        assertEquals(res,"done");
        res = csarPackageObj.getType();
        assertEquals(res,"type");
        res = csarPackageObj.getUrl();
        assertEquals(res,"//network");

    }

    @Test
    public void testPackageBasicInfoSetter() {
        pkgBasicInfoObj.setFormat("pdf");
        pkgBasicInfoObj.setProvider("huawei");
        pkgBasicInfoObj.setType(EnumType.GSAR);
        pkgBasicInfoObj.setVersion("1");
        String res = pkgBasicInfoObj.getFormat();
        assertEquals(res,"pdf");
        res = pkgBasicInfoObj.getProvider();
        assertEquals(res,"huawei");
        EnumType type = pkgBasicInfoObj.getType();
        assertEquals(type,EnumType.GSAR);
        res = pkgBasicInfoObj.getVersion();
        assertEquals(res,"1");
    }

    @Test
    public void testPackageMetaSetter() {
        pkgMetaObj.setCreateTime("05042017");
        pkgMetaObj.setCsarId("csarid");
        pkgMetaObj.setDeletionPending(true);
        pkgMetaObj.setDetails("details");
        pkgMetaObj.setDownloadCount(10);
        pkgMetaObj.setDownloadUri("//network");
        pkgMetaObj.setFormat("pdf");
        pkgMetaObj.setModifyTime("05042017");
        pkgMetaObj.setName("huawei");
        pkgMetaObj.setProvider("huawei");
        pkgMetaObj.setRemarks("tested");
        pkgMetaObj.setReport("done");
        pkgMetaObj.setShortDesc("done");
        pkgMetaObj.setSize("1000");
        pkgMetaObj.setType("type");
        pkgMetaObj.setVersion("1");

        String res = pkgMetaObj.getCreateTime();
        assertEquals(res,"05042017");
        res = pkgMetaObj.getCsarId();
        assertEquals(res,"csarid"); 
        res = pkgMetaObj.getDetails();
        assertEquals(res,"details");        
        res = pkgMetaObj.getDownloadCount()+"";
        assertEquals(res,"10");
        res = pkgMetaObj.getDownloadUri();
        assertEquals(res,"//network");
        res = pkgMetaObj.getFormat();
        assertEquals(res,"pdf");
        res = pkgMetaObj.getModifyTime();
        assertEquals(res,"05042017");
        res = pkgMetaObj.getName();
        assertEquals(res,"huawei");
        res = pkgMetaObj.getProvider();
        assertEquals(res,"huawei");
        res = pkgMetaObj.getRemarks();
        assertEquals(res,"tested");
        res = pkgMetaObj.getReport();
        assertEquals(res,"done");
        res = pkgMetaObj.getShortDesc();
        assertEquals(res,"done");
        res = pkgMetaObj.getSize();
        assertEquals(res,"1000");
        res = pkgMetaObj.getType();
        assertEquals(res,"type");
        res = pkgMetaObj.getVersion();          
        assertEquals(res,"1");
    }


    @Test
    public void testPackageResponseSetter() {
        pkgResponseObj.setReportPath("localpath");
        String res = pkgResponseObj.getReportPath();
        assertEquals(res,"localpath");

    }

    @Test
    public void testCsarFileUriResSetter() {
        csarFileUriResObj.setDownloadUri("downloaduri");
        csarFileUriResObj.setLocalPath("localpath");
        String res = csarFileUriResObj.getDownloadUri();
        assertEquals(res,"downloaduri");
        res = csarFileUriResObj.getLocalPath();
        assertEquals(res,"localpath");

    }
}
