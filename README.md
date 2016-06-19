# colorpages
I made a simple Node.js image server and companion web app using p5.js. It's a fun little program intended for use on digital picture frames, with an added interactive feature that converts images to coloring book pages. 

A remote computer runs the server program, referencing a folder of images on the machine. 

The web app, which runs best if embedded on a webpage (I use my neocities page), pulls random images from the folder, not pulling a repeat until every image in the folder is pulled once. The pulled images fill the display.

When a user clicks or touches the screen, a QR code will fade in, which links to a sobel-edge rendering of the image, stored on the server machine. The user can scan the QR code with a mobile device, and the device will be directed to the image file, where they may download it. 


###warning: if you want to set this up to work outside of a local network, you may open up your server machine to security breaches. Protecting your machine from bad guys is way beyond the scope of this silly app, so if you 

##TL;DR:
  Get Node.js
  Port forward 8080, or any port you want if you modify the server.js file
  Fill public/images folder with images, named 0.jpeg - whatever.jpeg
  Get a QR code with the text "http://yourIP:yourportnumber/qr.jpeg"
  Run server.js with node
  
  Host webapp files on website
  Change IP value in the sketch.js file to your server's IP
  Change the port to whatever port you're using, if you changed it
  ???
  Profit
  
##Installation: server
You will need to install Node.js. Google that and come back. If you want to access your images outside  a local network, you'll need to forward a port. Google that and come back if you have idea what that means. 

Once you do that, download the repo to your server machine. 
The port number I used is 8080. If you want to change it to whatever you want, open the server.js file and do so. Remember that port number. 
If you need to forward the port, do that now. 
Fill the "public/images" folder with your jpeg images, numbered starting with 0. 
I didn't write anything that generates a QR code automatically, instead I just use one of the thousdands of free QR code generators on the web. Make one that uses the text:

  "http://yourIP:yourportnumber/qr.jpeg"

yourIP is your public IP for your server machine. If you want to stay safe, doo't want to mess with port-forwarding or simply want to use this only on a local network, just use your local address (192.168.#.###). 

Save the QR code as a jpeg to the "public" folder.   

Once that's all done, open a terminal, navigate to where you downloaded the files, and execute the command:

    node server.js
    

##Installation: web app

Host the webapp folder in a way that it can be run on a web browser over the internet. I just use my neocities website. 
In webapp/sketch.js, change the IP address to the server's IP and the port to your port. If you left it alone on the server, leave it alone here.

If everything is hosted correctly, and the server is running, when you open the index.html file on a browser you should see one of the images from your image folder. 
Now if you click the screen (or if you have a fancy touch display, poke it), the image will fade away and reveal a QR code. Scan it with a mobile device and you'll get a "coloring book page" version of the image. Right now it's just a stock sobel-edge filtered image, but **eventually** it will have some further refinement. 


I like to run the web app on a raspberry pi hooked up to a framed digital display and a button simulating mouse input. If I'm bored, I'll press the button, scan the QR code, and print the image to color it in. 


## Future plans

- better Sobel Edge algorithm to make the coloring pages more like actual hand-crafted coloring pages
- easier installation
- more security features
- pull images from web rather than storing images on a personal drive
