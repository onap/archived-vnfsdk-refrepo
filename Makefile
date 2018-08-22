###############################################################################
# Shortcut targets
default: image
all: image

EMPTY :=
SPACE := $(EMPTY) $(EMPTY)
COMMA := $(EMPTY),$(EMPTY)

LINUX_ARCH := amd64 arm64
PLATFORMS := $(subst $(SPACE),$(COMMA),$(foreach arch,$(LINUX_ARCH),linux/$(arch)))

REGISTRY ?= nexus3.onap.org:10001/onap/vnfsdk/refrepo
VERSION := latest
TARGET := vnfsdk
DOCKERFILE := Dockerfile

DOCKERFILE_PATH := ./
POSTGRES_PATH := "vnfmarket-be/deployment/docker/docker-postgres/src/main/docker"
REFREPO_PATH := "vnfmarket-be/deployment/docker/docker-refrepo/src/main/docker"

MANIFEST_TOOL_DIR := /usr/local/bin
MANIFEST_TOOL_VERSION := v0.7.0

clean:
	rm -f ${POSTGRES_PATH}/Dockerfile-*
	rm -f ${REFREPO_PATH}/Dockerfile-*
	rm -f $(MANIFEST_TOOL_DIR)/manifest-tool

pre:
	for arch in $(LINUX_ARCH); do \
		if [ $$arch = arm64 ]; then \
			sed -e '/FROM ubuntu:16.04/r Dockerfile_header_arm64' ${POSTGRES_PATH}/Dockerfile > ${POSTGRES_PATH}/Dockerfile-$$arch; \
			sed -i 's/FROM ubuntu:16.04//g' ${POSTGRES_PATH}/Dockerfile-$$arch; \
			sed -e 's/postgres:/arm64v8\/postgres:/g' ${REFREPO_PATH}/Dockerfile > ${REFREPO_PATH}/Dockerfile-$$arch; \
		else \
			echo ""; \
        fi \
	done

pre_manifest:
	curl -sSL https://github.com/estesp/manifest-tool/releases/download/$(MANIFEST_TOOL_VERSION)/manifest-tool-linux-amd64 > $(MANIFEST_TOOL_DIR)/manifest-tool
	chmod +x $(MANIFEST_TOOL_DIR)/manifest-tool

###############################################################################
# Building docker images
###############################################################################
build_image:
	docker build -t $(REGISTRY)/$(TARGET):$(VERSION) -f $(DOCKERFILE) $(DOCKERFILE_PATH)
image: pre
	for arch in $(LINUX_ARCH); do \
		if [ $$arch = amd64 ]; then \
			$(MAKE) build_image TARGET="postgres-$$arch" DOCKERFILE=${POSTGRES_PATH}/Dockerfile DOCKERFILE_PATH=$(POSTGRES_PATH); \
			$(MAKE) build_image TARGET="refrepo-$$arch" DOCKERFILE=${REFREPO_PATH}/Dockerfile DOCKERFILE_PATH=$(REFREPO_PATH); \
		elif [ $$arch = arm64 ]; then \
			$(MAKE) build_image TARGET="postgres-$$arch" DOCKERFILE=${POSTGRES_PATH}/Dockerfile-$$arch DOCKERFILE_PATH=$(POSTGRES_PATH); \
			$(MAKE) build_image TARGET="refrepo-$$arch" DOCKERFILE=${REFREPO_PATH}/Dockerfile-$$arch DOCKERFILE_PATH=$(REFREPO_PATH); \
		else \
			echo "ARCH unknown"; \
		fi \
	done

###############################################################################
# push images, please use command: make push
###############################################################################
push-manifest:
	$(MANIFEST_TOOL_DIR)/manifest-tool push from-args --platforms $(PLATFORMS) --template $(REGISTRY)/$(TARGET)-ARCH:$(VERSION) --target  $(REGISTRY)/$(TARGET):$(VERSION)

push-single-image:
	docker push $(REGISTRY)/$(TARGET):$(VERSION)

push: pre_manifest
	for arch in $(LINUX_ARCH); do \
		$(MAKE) push-single-image TARGET="postgres-$$arch"; \
		$(MAKE) push-single-image TARGET="refrepo-$$arch"; \
	done
	$(MAKE) push-manifest TARGET="postgres"
	$(MAKE) push-manifest TARGET="refrepo"
