FROM certbot/certbot:v1.27.0

COPY certbot-init.sh /opt/
RUN chmod +x /opt/certbot-init.sh

ENTRYPOINT []
CMD ["certbot", "renew"]