/*
 * Copyright 2016 Huawei Technologies Co., Ltd.
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

package org.openo.vnfsdk.marketplace.common;

import java.io.File;
import java.io.IOException;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Json tools class, packaging a number of commonly used Json methods.<br>
 * 
 * @author
 * @version GSO 0.5 2016-08-26
 */
public final class JsonUtil {

    private static final Logger LOGGER = LoggerFactory.getLogger(JsonUtil.class);

    private JsonUtil() {
    }

    /**
     * Convert object to JSON.<br>
     * 
     * @param obj The object to be converted
     * @return The JSON string
     * @since GSO 0.5
     */
    public static String toJson(Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch(IOException ex) {
            LOGGER.error("Parser to json error.", ex);
            throw new IllegalArgumentException("Parser obj to json error, obj = " + obj, ex);
        }
    }

    /**
     * Convert JSON to object.<br>
     * 
     * @param jsonStr The JSON to be converted
     * @param objClass The object class
     * @return The objClass object
     * @since GSO 0.5
     */
    public static <T> T fromJson(String jsonStr, Class<T> objClass) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            return mapper.readValue(jsonStr, objClass);
        } catch(IOException ex) {
            LOGGER.error("Parser to object error.", ex);
            throw new IllegalArgumentException(
                    "Parser json to object error, json = " + jsonStr + ", expect class = " + objClass, ex);
        }
    }

    /**
     * Convert JSON to object.<br>
     * 
     * @param jsonStr The JSON to be converted
     * @param typeRef The object type
     * @return The typeRef object
     * @since GSO 0.5
     */
    public static <T> T fromJson(String jsonStr, TypeReference<T> typeRef) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            return mapper.readValue(jsonStr, typeRef);
        } catch(IOException ex) {
            LOGGER.error("Parser to object by type reference error.", ex);
            throw new IllegalArgumentException(
                    "Parser json to object error, json = " + jsonStr + ", expect type = " + typeRef.getType(), ex);
        }
    }

    /**
     * Turn a json file in to a java object. <br>
     * 
     * @param file the json file need to change.
     * @param objClass the java class json string represent.
     * @return the java object parsed from json string.
     * @since GSO 0.5
     */
    public static <T> T fromJson(File file, Class<T> objClass) {
        try {

            ObjectMapper mapper = new ObjectMapper();

            mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            return mapper.readValue(file, objClass);
        } catch(IOException ex) {
            LOGGER.error("Parser to object error.", ex);
            throw new IllegalArgumentException(
                    "Parser json to object error, file = " + file.getName() + ", expect class = " + objClass, ex);
        }
    }
}
