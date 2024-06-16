Asata ict file server

this is a project designed to be used for file management and control
within ict department

######################################################################
You need to know the IP address of your machine. Open your cmd and write in “ipconfig” to get it.
Now you need to run the development server such that you make it viewable to other machines on the network:
python manage.py runserver 0.0.0.0:8000
Open browser on another computer and type in:
<main computer IP address>:8000
Also check your firewall whether incoming connections to the port in use are allowed

######################################################################