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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonSerializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonArray;
import com.google.gson.reflect.TypeToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Type;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;

public class VTPModelBase {
    public static final Logger logger = LoggerFactory.getLogger(VTPModelBase.class);

    public String toJsonString() {
        return toJsonString(this);
    }

    public static String toJsonString(Object obj) {
        try {
            Gson gson = new GsonBuilder()
                    .registerTypeHierarchyAdapter(Collection.class, new CollectionAdapter())
                    .create();
            String jsonString = gson.toJson(obj);
            Map<String, Object> mapData = gson.fromJson(jsonString, new TypeToken<Map<String, Object>>() {
            }.getType());

            for (Iterator<Map.Entry<String, Object>> itr = mapData.entrySet().iterator(); itr.hasNext(); ) {
                Map.Entry<String, Object> entry = itr.next();
                if (entry.getValue() == null
                        || entry.getValue().toString().isEmpty()
                        || entry.getValue().toString().equals("{}")) {
                    itr.remove();
                }
                if (entry.getValue().toString().startsWith("{")) {
                    JsonObject jobj = gson.fromJson(gson.toJson(entry.getValue()), JsonObject.class);
                    if (jobj.size() > 0) {
                        entry.setValue(cleanObject(jobj));
                    }
                }
            }
            return gson.toJson(mapData);
        } catch (JsonParseException e) {
            return "{}";
        }
    }

    public String toString() {
        return this.toJsonString();
    }

    static JsonObject cleanObject(Object obj) {
        Gson gson = new Gson();
        String jsonString = gson.toJson(obj);
        Map<String, Object> mapData = gson.fromJson(jsonString, new TypeToken<Map<String, Object>>() {
        }.getType());

        for (Iterator<Map.Entry<String, Object>> itr = mapData.entrySet().iterator(); itr.hasNext(); ) {
            Map.Entry<String, Object> entry = itr.next();
            if (entry.getValue() == null
                    || entry.getValue().toString().isEmpty()
                    || entry.getValue().toString().equals("{}")) {
                itr.remove();
            }
            if (entry.getValue().toString().startsWith("{")) {

                JsonObject jobj = gson.fromJson(gson.toJson(entry.getValue()), JsonObject.class);
                if (jobj.size() > 0) {
                    entry.setValue(cleanObject(jobj));
                }
            }
        }

        return gson.fromJson(gson.toJson(mapData), JsonObject.class);

    }

    static class CollectionAdapter implements JsonSerializer<Collection<?>> {
        @Override
        public JsonElement serialize(Collection<?> src, Type typeOfSrc,
                                     JsonSerializationContext context) {
            if (src == null || src.isEmpty())
                return null;

            JsonArray array = new JsonArray();
            for (Object child : src) {

                child = cleanObject(child);
                JsonElement element = context.serialize(child);


                array.add(element);
            }

            return array;
        }
    }


}
