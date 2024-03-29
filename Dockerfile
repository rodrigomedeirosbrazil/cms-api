# FROM node:alpine
FROM hasura/graphql-engine:v1.3.3-centos

RUN sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-* && \
    sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-* && \
    yum update -y && yum install -y yum-utils curl nss epel-release\
    && curl -sL https://rpm.nodesource.com/setup_14.x | bash - \
    && yum install -y               \
    vim                             \
    supervisor                      \
    nodejs                          \
    nginx                           \
    wget &&                         \
    yum clean all

WORKDIR /usr/app

# Install app dependencies
COPY package.json ./
RUN npm install && npm cache clean --force

# Bundle app source
COPY . .

COPY nginx_reverse_proxy.conf /etc/nginx/nginx.conf.template
COPY nginx_proxy.conf /etc/nginx/includes/proxy.conf
COPY supervisord.conf /etc/supervisord.conf.template

COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

CMD ["/docker-entrypoint.sh"]
