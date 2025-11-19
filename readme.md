# Communication Contract

### Requesting Data

Requesting data is done through an HTTP request. The path of the request is used
to specify an action with the request:

POST Requests:
- `/submit`: Must be a post **OF enctype="multipart/form-data"** form, with a submitImage file property, and a submitName text property in the body. This will return the status of the upload. The uploaded image will be stored on the server under the specified name.

#### Example Request

```
<div class="submission">
    <h1>Group 16 Image service submission form</h1>
    <form action="localhost:3003/submit" method="post" enctype="multipart/form-data">
        

        <label for="submitName">
            <i class="fas fa-italic"></i>
        </label>
        <input type="text" name="submitName" placeholder="image title" id="submitName" required>

        <label for="submitImage">
            <!-- font awesome icon -->
            <i class="fas fa-image"></i>
        </label>
        <input type="file" name="submitImage" id="submitImage" accept="image/*" required>

        <input type="submit" value="Submit">
    </form>
</div>
```

### Receiving Data

The server will send back a boolean, true or false, reflecting the acceptance or denial of the file.
To access the uploaded file, simply call its image/filename route.

#### Example Receive

```
<img src="http://localhost:3003/image/filename.jpg">
```

### Debug/direct access routes
GET Requests:
- `/`: No request body, session information (cookies) are read out to the console.
- `/login`: Displays a test page with a login form that will call /auth when submitted.
- `/logout`: No request body, session information (cookies) are modified.
- `/reset-database`: Resets the database using the defined stored procedure.

### UML Sequence Diagram

<img src="./static/umlSequence.jpg" alt="UML sequence diagram">
