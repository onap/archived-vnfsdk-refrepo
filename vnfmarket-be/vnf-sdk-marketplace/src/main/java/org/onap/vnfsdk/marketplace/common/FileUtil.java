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
package org.onap.vnfsdk.marketplace.common;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;
import java.io.FileWriter;
import java.io.FileReader;

public final class FileUtil {

	public static final Logger logger = LoggerFactory.getLogger(FileUtil.class);

	private static final int BUFFER_SIZE = 2 * 1024 * 1024;

	private static final int MAX_PACKAGE_SIZE = 50 * 1024 * 1024;
	private static Gson gson = new Gson();

	private FileUtil() {
		//Empty constructor
	}

	/**
	 * create dir.
	 * 
	 * @param dir
	 *            dir to create
	 * @return boolean
	 */
	public static boolean createDirectory(String dir) {
		File folder = new File(dir);
			if (!folder.exists() && !folder.mkdirs()) {
				return false;
			} else {
				return true;
			}
	}

	/**
	 * delete file.
	 * 
	 * @param file
	 *            the file to delete
	 * @return boolean
	 */
	public static boolean deleteFile(File file) {
		String hintInfo = file.isDirectory() ? "dir " : "file ";
		boolean isFileDeleted = file.delete();
		boolean isFileExist = file.exists();
		if (!isFileExist) {
			if (isFileDeleted) {
				logger.info("delete {} {}" ,hintInfo, file.getAbsolutePath());
			} else {
				isFileDeleted = true;
				logger.info("file not exist. no need delete {} {}" ,hintInfo , file.getAbsolutePath());
			}
		} else {
			logger.info("fail to delete {} {} " , hintInfo , file.getAbsolutePath());
		}
		return isFileDeleted;
	}

	/**
	 * unzip zip file.
	 * 
	 * @param zipFileName
	 *            file name to zip
	 * @param extPlace
	 *            extPlace
	 * @return unzip file name
	 * @throws IOException
	 *             e1
	 */
	public static List<String> unzip(String zipFileName, String extPlace) throws IOException {
		List<String> unzipFileNams = new ArrayList<>();

		try (ZipFile zipFile = new ZipFile(zipFileName);) {
			Enumeration<?> fileEn = zipFile.entries();
			byte[] buffer = new byte[BUFFER_SIZE];

			while (fileEn.hasMoreElements()) {
				ZipEntry entry = (ZipEntry) fileEn.nextElement();
				if (entry.isDirectory()) {
					continue;
				}

				File file = new File(extPlace, entry.getName());
				if (!file.getParentFile().exists()) {
					createDirectory(file.getParentFile().getAbsolutePath());
				}

				try (InputStream input = zipFile.getInputStream(entry);
					    BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file));) {
					int length = 0;
					while ((length = input.read(buffer)) != -1) {
						bos.write(buffer, 0, length);
					}
					unzipFileNams.add(file.getAbsolutePath());
				}
			}
		}
		return unzipFileNams;
	}

	public static boolean checkFileExists(String filePath) {
		File file = new File(filePath);
		return file.exists();
	}

	public static boolean deleteFile(String filePath) {
		File file = new File(filePath);
		return deleteFile(file);
	}

	public static boolean writeJsonDatatoFile(String fileAbsPath, Object obj) {
		logger.info("Write JsonData to file : {} " , fileAbsPath);

		boolean bResult = false;
		if (checkFileExists(fileAbsPath)) {
			deleteFile(fileAbsPath);
		}

		try(FileWriter writer = new FileWriter(new File(fileAbsPath))) {
			gson.toJson(obj, writer);
			bResult = true;
		} catch (Exception e) { //NOSONAR
			logger.info("Exception: writeJsonDatatoFile-->" + fileAbsPath, e);
		}
		return bResult;
	}

	public static <T> Object readJsonDatafFromFile(String fileAbsPath, Class<T> clazz) {
		if (!checkFileExists(fileAbsPath)) {
			logger.info("read JsonData from file , file not found : {}" ,fileAbsPath);
			return null;
		}

		logger.info("read JsonData from file : {}" , fileAbsPath);

		T obj = null;
		/*
           Gson will ignore the unknown fields and simply match the fields that it's able to.
           ref: https://www.baeldung.com/gson-deserialization-guide

           By default, Gson just ignores extra JSON elements that do not have matching Java fields.
           ref: https://programmerbruce.blogspot.com/2011/06/gson-v-jackson.html
        */
		try(JsonReader jsonReader = new JsonReader(new FileReader(fileAbsPath))) {
			obj = gson.fromJson(jsonReader, clazz);
		} catch (Exception e1) { //NOSONAR
			logger.info("IOException Exception: writeJsonDatatoFile-->" + fileAbsPath, e1);
		}
		return obj;
	}

	public static boolean deleteDirectory(String path) {
		File file = new File(path);
		return deleteDirectory(file);
	}

	public static boolean deleteDirectory(File file) {
		if (!file.exists()) {
			return true;
		}
		if (file.isDirectory()) {
			for (File f : file.listFiles()) {
				deleteDirectory(f);
			}
		}
		return file.delete();
	}

	public static boolean validateStream(FileInputStream ifs) {

		if (null == ifs) {
			logger.error("File stream is null");
			return false;
		}

		try {
			if (!ifs.getFD().valid()) {
				logger.error("File descriptor is not valid");
				return false;
			}
		} catch (IOException e) {
			logger.error("Exception while getting File descriptor", e);
		}

		return true;
	}

	public static boolean validatePath(String path) {
		if (!new File(path).isDirectory()) {
			logger.error("File is not a directory");
			return false;
		}
		return true;
	}

	public static boolean validateFile(File fileData) {
		if (null == fileData) {
			logger.error("File data is null");
			return false;
		}

		if (MAX_PACKAGE_SIZE < fileData.length()) {
			logger.error("File size is greater than 50 MB {}", fileData.length());
			return false;
		}

		return true;
	}
}
