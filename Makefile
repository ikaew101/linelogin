# How to run:
# make image-dev
image-dev:
	docker build --platform linux/x86_64 -f Dockerfile -t tdg-dev/energy_frontend .

# How to run:
# make image-prod
image-prod:
	docker build --platform linux/x86_64 -f Dockerfile -t tdg-prod/energy_frontend .

# make deploy-dev
deploy-dev:
	make image-dev
	docker tag $(docker images -q tdg-dev/energy_frontend) registry-intl.ap-southeast-1.aliyuncs.com/lotuss/frontend_new:latest
	docker push registry-intl.ap-southeast-1.aliyuncs.com/lotuss/frontend_new:latest

# make deploy-prod
deploy-prod:
	make image-prod
	docker tag $(docker images -q tdg-prod/energy_frontend) registry-intl.ap-southeast-1.aliyuncs.com/smart-energy/frontend:latest
	docker push registry-intl.ap-southeast-1.aliyuncs.com/smart-energy/frontend:latest


# make deploy-prod:v1.1.2.17
deploy-prod:
	make image-prod
	docker tag $(docker images -q tdg-prod/energy_frontend) registry-intl.ap-southeast-1.aliyuncs.com/smart-energy/frontend:v1.1.2.17
	docker push registry-intl.ap-southeast-1.aliyuncs.com/smart-energy/frontend:v1.1.2.17
