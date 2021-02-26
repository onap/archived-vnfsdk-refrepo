# Changelog
All notable changes to this project will be documented in this file.


## [1.6.0]

### Added
- Update java to 11 in the refrepo image 
    - https://jira.onap.org/browse/VNFSDK-646
- Update certs expiration date from default 30 days to 730 days (2 years)
    - https://jira.onap.org/browse/VNFSDK-650

## [1.6.1]

### Fix
- Fix JSON parsing error returned from GET request
  - https://jira.onap.org/browse/VNFSDK-697 

## [1.6.2]

### Fix
- Fix OCLIP version used during docker image build, by setting it to 5.0.3
  - https://jira.onap.org/browse/VNFSDK-698 
- Fix oclip issue and updated OCLIP version used during docker image build, back to 6.0.0
  - https://jira.onap.org/browse/CLI-325
  
### Added
- Updated validation version to 1.2.14

## [1.6.3]

### Added
- Add validation-pmdictionary*.jar to docker container
  - https://jira.onap.org/browse/VNFSDK-713
- Add cli to pmdictionary validation
  - https://jira.onap.org/browse/VNFSDK-715
- Updated OCLIP version used during docker image build to 6.0.1
  - https://jira.onap.org/browse/VNFSDK-731
- Remove python 2.7 from the refrepo image
  - https://jira.onap.org/browse/VNFSDK-647

## [1.6.4]
