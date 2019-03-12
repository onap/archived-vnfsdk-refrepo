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

package org.onap.vtp.error;

import org.eclipse.jetty.http.HttpStatus;
import org.onap.vtp.VTPModelBase;

public class VTPError extends VTPModelBase {
    private String code = "";

    private String message;

    private int httpStatus = HttpStatus.INTERNAL_SERVER_ERROR_500;

    public static final String TIMEOUT = "0x9999";

    protected static final String []NOT_FOUND = new String []{
            "0xc002", //Profile not found
            "0x6003",  //Command not found
            "0x6009", //Execution not found
            "0x21003"  //Artifact not found
    };

    public String getCode() {
        return code;
    }

    public VTPError setCode(String code) {
        this.code = code;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public VTPError setMessage(String message) {
        this.message = message;

        for (String errorCode : NOT_FOUND) {
            if (message.startsWith(errorCode)) {
                this.code = errorCode;
                this.httpStatus = HttpStatus.NOT_FOUND_404;
                this.message = message.split("::")[1];
                break;
            }
        }
        return this;
    }

    public int getHttpStatus() {
        return httpStatus;
    }

    public VTPError setHttpStatus(int httpStatus) {
        this.httpStatus = httpStatus;
        return this;
    }

    public static class VTPException extends Exception {
        private static final long serialVersionUID = -2894780740467107391L;

        VTPError error; // NOSONAR

        public VTPException(VTPError error) {
            this.error = error;
        }

        @Override
        public String getMessage() {
            return this.error.toJsonString();
        }

        public VTPError getVTPError() {
            return this.error;
        }
    }
}
