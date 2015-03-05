<!DOCTYPE html>
<html>
  <head>
    <title>RPi-Monitor</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" />
    <script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
    <script src="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
  </head>
  <body>
    <div data-role="page" id="main">
      <div data-role="content">
        <div data-role="fieldcontain">
          <label for="fieldcontain-custom-1">RPi address:</label>
          <input type="text" name="url" id="url" style="text-align:center" value="">
          <br>
          <label for="fieldcontain-custom-2">Example: http://192.168.1.100:8888</label>
        </div>
        
        <div data-role="fieldcontain">
          <label for="fieldcontain-custom-1">Enable Authentication:</label>
          <select id="auth" name="auth" data-role="slider">
              <option value="0">Off</option>
              <option value="1">On</option>
          </select>
        </div>
        <div data-role="fieldcontain">
          <label for="fieldcontain-custom-1">User:</label>
          <input type="text" name="user" id="user" style="text-align:center" value="">

          <label for="fieldcontain-custom-1">Password:</label>
          <input type="password" name="pass" id="pass" style="text-align:center" value="">
        </div>

        <div class="ui-body ui-body-b">
          <fieldset class="ui-grid-a">
            <div class="ui-block-a"><button type="submit" data-theme="d" id="b-cancel">Cancel</button></div>
            <div class="ui-block-b"><button type="submit" data-theme="a" id="b-submit">Submit</button></div>
          </fieldset>
        </div>

        <div data-role="fieldcontain">
        <p>1. Install <a href="http://rpi-experiences.blogspot.fr">RPi-Monitor</a> on your Raspberri Pi.</p>
        <p>2. Enter address your Raspberry Pi in text box above.</p>
        <p>3. Enjoy!</p>
        <br/>
        <p align="center">Thanks to <a href="http://rpi-experiences.blogspot.fr">Xavier Berger</a></p>
        <p align="center">Authentication by <a href="http://oscarrc.tk">Oscar R.C.</a></p>
        <p align="center">With &#9825; from Russia</p>
        </div>
      </div>
    </div>
    <script>
        $().ready(function() {
            $('#url').val(JSON.parse(localStorage.getItem('host')));
            $('#user').val(JSON.parse(localStorage.getItem('user')));
            $('#pass').val(JSON.parse(localStorage.getItem('pass')));
            $('#auth').val(JSON.parse(localStorage.getItem('auth'))).slider('refresh');
            
            $("#b-cancel").click(function() {
                document.location = "pebblejs://close";
            });
        
            $("#b-submit").click(function() {
                var options = {
                    'host': $("#url").val(),
                    'user': $("#user").val(),
                    'pass': $("#pass").val(),
                    'auth': $("#auth").val()
                }
                
                localStorage.setItem('host', JSON.stringify(options.host));
                localStorage.setItem('user', JSON.stringify(options.user));
                localStorage.setItem('pass', JSON.stringify(options.pass));
                localStorage.setItem('auth', JSON.stringify(options.auth));

                location.href = "pebblejs://close#" + encodeURIComponent(JSON.stringify(options));
            });
        });
    </script>
  </body>
