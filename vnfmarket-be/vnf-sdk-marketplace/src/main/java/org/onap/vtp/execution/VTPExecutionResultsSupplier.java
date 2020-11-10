/**
 * Copyright 2020 Nokia.
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

package org.onap.vtp.execution;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Optional;
import com.google.gson.JsonParser;

public class VTPExecutionResultsSupplier {

    public static final Logger logger = LoggerFactory.getLogger(VTPExecutionResultsSupplier.class);

    private static final String SUB_PATH_TO_EXECUTION_OUTPUT = "/output";
    private static final Gson gson = new Gson();
    private static final JsonParser jsonParser = new JsonParser();
    protected String pathToExecutions;

    VTPExecutionResultsSupplier(String pathToExecutions) {
        this.pathToExecutions = pathToExecutions;
    }

    public JsonElement getExecutionOutputsFromFile(String executionId) {
        File directoryWithExecutionFiles = new File(pathToExecutions);
        return getExecutionFilesForGivenRequest(executionId, directoryWithExecutionFiles)
            .map(this::getOutputOfLatestExecutionFile)
            .orElse(createNoOutputFileErrorMessageInJsonFormat());
    }

    private Optional<File[]> getExecutionFilesForGivenRequest(String requestId, File directoryWithExecutionsData) {
        return Optional.ofNullable(
            directoryWithExecutionsData.listFiles((dir, name) -> name.startsWith(requestId))
        );
    }

    private JsonElement getOutputOfLatestExecutionFile(File[] directoriesWithExecutionsData) {
        return Arrays.stream(directoriesWithExecutionsData)
            .max(Comparator.comparing(File::lastModified))
            .map(file -> new File(file.getAbsolutePath() + SUB_PATH_TO_EXECUTION_OUTPUT))
            .filter(File::exists)
            .map(this::loadOutputJsonFromFile)
            .orElse(createNoOutputFileErrorMessageInJsonFormat());
    }

    private JsonElement loadOutputJsonFromFile(File file) {
        JsonElement outputJson;
        try {
            String executionResult = Files.readString(file.toPath());
            outputJson = jsonParser.parse(executionResult);
        } catch (IOException | JsonParseException e) {
            logger.error(e.getMessage(),e);
            String errorMessage = "" +
                "{ \"error\": \"fail to load execution result\",\"reason\":\"" + e.getMessage() + "\"}";
            outputJson = gson.fromJson(errorMessage, JsonObject.class);
        }
        return outputJson;
    }

    private JsonElement createNoOutputFileErrorMessageInJsonFormat() {
        return gson.fromJson("{ \"error\": \"unable to find execution results\"}", JsonObject.class);
    }
}
