/**
 *
 * "Copyright, European Software Marketing Ltd.,, 2017 [the year/s in which the code was created]
 * ===================================================================
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License"
 */
package org.onap.vnfsdk.marketplace.exception;

public class InputValidationException extends CoreException {
    public InputValidationException(String message) {
        super(message);
    }

    @Override
    public ErrorCategory getErrorCategory() {
        return ErrorCategory.VALIDATION;
    }
}
