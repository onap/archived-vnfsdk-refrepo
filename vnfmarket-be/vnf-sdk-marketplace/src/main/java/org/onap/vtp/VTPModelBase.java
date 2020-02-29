/**
 * Copyright 2019 Huawei Technologies Co., Ltd.
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

package org.onap.vtp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.gson.Gson;

public class VTPModelBase {
    public static final Logger logger = LoggerFactory.getLogger(VTPModelBase.class);
    private static Gson gson = new Gson();

    public String toJsonString() {
        return toJsonString(this);
    }

    public static String toJsonString(Object obj) {
        try {
            /*
            The default behaviour implemented in Gson is that null object fields are ignored.
            Means Gson object does not serialize fields with null values to JSON.
            If a field in a Java object is null, Gson excludes it.
            ref: http://tutorialtous.com/gson/serializingNullFields.php
            ref: https://howtodoinjava.com/gson/serialize-null-values/
            */
            return gson.toJson(obj);
        } catch (Exception e) { //NOSONAR
            logger.error("Exception occurs ",e);
            return "{}";
        }
    }

    public String toString() {
        return this.toJsonString();
    }
}
