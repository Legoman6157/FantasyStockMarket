FROM nginx
COPY index.html /usr/share/nginx/html
COPY interface.css /usr/share/nginx/html
COPY main.js /usr/share/nginx/html
RUN mkdir /usr/share/nginx/html/images
COPY images/scroll-5.png /usr/share/nginx/html/images
COPY bg-right.png /usr/share/nginx/html/images
