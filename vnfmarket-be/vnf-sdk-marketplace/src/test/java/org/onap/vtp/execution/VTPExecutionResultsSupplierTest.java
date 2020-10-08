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
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class VTPExecutionResultsSupplierTest {

    private static final String TEST_PATH_TO_EXECUTION = "src/test/resources/executions";

    @Test
    public void whenGetExecutionOutputsFromFileIsCalledWithPathToCorrectFileThenContentShouldBeLoadedAsJsonArray() {
        // given
        VTPExecutionResultsSupplier vtpExecutionResultsSupplier =
            new VTPExecutionResultsSupplier(TEST_PATH_TO_EXECUTION);
        String pathToCorrectFile = "test-01-request-id-execution-id";
        JsonElement expectedResult = new Gson().fromJson("" +
            "[{" +
            "\"test_1\": \"error01\"," +
            "\"test_2\": \"error02\" " +
            "}]", JsonArray.class);

        // when
        JsonElement executionOutputsFromFile =
            vtpExecutionResultsSupplier.getExecutionOutputsFromFile(pathToCorrectFile);

        // then
        assertEquals(executionOutputsFromFile, expectedResult);
    }

    @Test
    public void whenGetExecutionOutputsFromFileIsCalledWithPathToCorrectFileThenContentShouldBeLoadedAsJsonObject() {
        // given
        VTPExecutionResultsSupplier vtpExecutionResultsSupplier =
            new VTPExecutionResultsSupplier(TEST_PATH_TO_EXECUTION);
        String pathToCorrectFile = "test-02-request-id-execution-id";
        JsonElement expectedResult = new Gson().fromJson("" +
            "{" +
            "\"test_1\": \"error01\"," +
            "\"test_2\": \"error02\" " +
            "}", JsonObject.class);

        // when
        JsonElement executionOutputsFromFile =
            vtpExecutionResultsSupplier.getExecutionOutputsFromFile(pathToCorrectFile);

        // then
        assertEquals(executionOutputsFromFile, expectedResult);
    }

    @Test
    public void whenGetExecutionOutputsFromFileIsCalledWithPathToNonExistingFileThenProperMessageShouldBeReturned() {
        // given
        VTPExecutionResultsSupplier vtpExecutionResultsSupplier =
            new VTPExecutionResultsSupplier(TEST_PATH_TO_EXECUTION);
        String pathToCorrectFile = "test-wrong-request-id-execution-id";
        JsonElement expectedErrorMessage = new Gson().fromJson("" +
            "{ \"error\": \"unable to find execution results\"}", JsonObject.class);

        // when
        JsonElement executionOutputsFromFile =
            vtpExecutionResultsSupplier.getExecutionOutputsFromFile(pathToCorrectFile);

        // then
        assertEquals(expectedErrorMessage, executionOutputsFromFile);
    }

    @Test
    public void whenGetExecutionOutputsFromFileIsCalledWithPathToIncorrectFileThenProperMessageShouldBeReturned() {
        // given
        VTPExecutionResultsSupplier vtpExecutionResultsSupplier =
            new VTPExecutionResultsSupplier(TEST_PATH_TO_EXECUTION);
        String pathToCorrectFile = "test-incorrect-request-id-execution-id-data";
        JsonElement expectedErrorMessage = new Gson().fromJson("" +
            "{ " +
                "\"error\": \"fail to load execution result\"," +
                "\"reason\":\"com.google.gson.stream.MalformedJsonException: Use JsonReader.setLenient(true) to accept malformed JSON at line 1 column 8 path $\"" +
                "}",
            JsonObject.class
        );

        // when
        JsonElement executionOutputsFromFile =
            vtpExecutionResultsSupplier.getExecutionOutputsFromFile(pathToCorrectFile);

        // then
        assertEquals(expectedErrorMessage, executionOutputsFromFile);
    }
}
