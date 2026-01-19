FROM php:8.4-fpm

# Set working directory
WORKDIR /var/www/qw

# Install dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev \
    build-essential \
    libxml2-dev \
    libldap2-dev \
    libpq-dev \
    locales \
    vim \
    unzip \
    git \
    curl \
    default-mysql-client

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install extensions
RUN docker-php-ext-install pdo_mysql zip exif pcntl soap ldap sockets

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
