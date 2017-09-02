/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function () {
    if (localStorage.getItem('user_token')) {
      document.querySelector('#myNavigator').setAttribute('page', 'main.html');
    }
    else {
      document.querySelector('#myNavigator').setAttribute('page', 'login.html');
    }
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    this.receivedEvent('deviceready');
    this.checkLocalStore();

  },

  //Check localstorage
  checkLocalStorage: function () {
    if (typeof (Storage) == "undefined") {
      alert('Error: cannot set up local storage');
    }
  },

  // Update DOM on a Received Event
  receivedEvent: function (id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  },

}

app.initialize();

document.addEventListener('init', function (event) {
  var page = event.target;

  if (page.id === 'login') {
    page.querySelector('#loginButton').onclick = function () {
      login();
    };
    // page.querySelector('#registerButton').onclick = function () {
      // document.querySelector('#myNavigator').pushPage('register.html');
    // };
  } else if (page.id === 'main') {
    page.querySelector('#logoutButton').onclick = function () {
      localStorage.removeItem('user_token');
      document.querySelector('#myNavigator').replacePage('login.html');
    }
  } else if (page.id === 'register') {
    page.querySelector('#registerButton').onclick = function () {
      register();
    };
    //page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  }
});


var login = function () {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  $.ajax({
    // 'url' : 'http://localhost:3306/api/v1/users/login',
    'url': 'http://blaszku.alwaysdata.net/api/v1/users/login',

    'type': 'POST',

    'data': {
      'login': username,
      'password': password
    },

    'success': function (data) {
      if (data.token) {
        localStorage.setItem('user_token', data.token);
        //document.querySelector('#myNavigator').pushPage('page2.html', {data: {title: 'Page 2'}});
        document.querySelector('#myNavigator').replacePage('main.html');
      }
      else {
        ons.notification.alert(data.error);
      }
    },
    'error': function (xhr, status, error) {
      var json = $.parseJSON(xhr.responseText);

      ons.notification.alert(json.error);
    }

  });
};

var register = function () {
  var username = document.getElementById('reg_username').value;
  var password = document.getElementById('reg_password').value;
  var confirm_password = document.getElementById('reg_confirm_password').value;

  if (password != confirm_password) {
    ons.notification.alert('Passwords are different');
    document.getElementById('reg_username').value = '';
    document.getElementById('reg_password').value = '';
    document.getElementById('reg_confirm_password').value = '';

  }
  else {
    $.ajax({
      // 'url' : 'http://localhost:3306/api/v1/users/add',  
      'url': 'http://blaszku.alwaysdata.net/api/v1/users/add',
      'type': 'POST',

      'data': {
        'login': username,
        'password': password
      },

      'success': function (data) {
        ons.notification.alert(data.msg);
        localStorage.setItem('user_token', data.token);
        document.querySelector('#myNavigator').resetToPage('main.html');
        // login();
      },
      'error': function (xhr, status, error) {
        var json = $.parseJSON(xhr.responseText);
        ons.notification.alert(json.error);
      }
    });
  }
}

var date = function () {
  var options = {
    date: new Date(),
    mode: 'date'
  };

  function onSuccess(date) {
    alert('Selected date: ' + date);
  }

  function onError(error) { // Android only
    alert('Error: ' + error);
  }

  datePicker.show(options, onSuccess, onError);
}

var contacts = function name() {
  
    function onSuccess(contacts) {
        //alert('Found ' + contacts.length + ' contacts.');
        // document.getElementById('contactInformation').innerHTML = JSON.stringify(contacts, null, 4);
    };

    function onError(contactError) {
      alert('onError!');
    };
      // find all contacts with 'me' in any name field
      var options      = new ContactFindOptions();
      options.filter   = "";
      options.multiple = true;
      //options.desiredFields = [navigator.contacts.fieldType.id];
      var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
      navigator.contacts.find(fields, onSuccess, onError, options);
}

