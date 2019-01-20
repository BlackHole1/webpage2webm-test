FROM  ubuntu

MAINTAINER Black-Hole

# install ENV
RUN apt-get update -y \
  && apt-get install -y \
    xvfb \
    nodejs \
    npm
RUN apt-get install -y \
  vim \
  locales \
  libx11-xcb1 \
  libxrandr2 \
  libasound2 \
  libpangocairo-1.0-0 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libnss3 \
  libxss1
RUN apt-get -y install ttf-wqy-microhei ttf-wqy-zenhei

# Set the timezone
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Ensure UTF-8 locale
RUN locale-gen zh_CN.UTF-8 \
  && DEBIAN_FRONTEND=noninteractive dpkg-reconfigure locales
RUN locale-gen zh_CN.UTF-8
ENV LANG zh_CN.UTF-8
ENV LANGUAGE zh_CN:zh
ENV LC_ALL zh_CN.UTF-8

RUN npm install -g node-gyp
WORKDIR /etc/www
COPY ./ /etc/www
RUN npm install
ENTRYPOINT ["sh", "-c", "xvfb-run node export.js"]
