var Widgets = Widgets ? Widgets : function () {

    var private = {

        host: null,
        container: null,
        callback: null,

        jsonpcall: function (fn, paramArray, callbackFn) {
            // Create list of parameters in the form (http get format):
            // paramName1 = paramValue1 & paramName2 = paramValue2 &
            var paramList = '';
            if (paramArray.length > 0) {
                for (var i = 0; i < paramArray.length; i += 2) {
                    paramList += paramArray[i] + '=' + paramArray[i + 1] + '&';
                }
            }
            $.getJSON('http://' + private.host + '/Widgets/' + fn + '?' + paramList + 'callback=?',
                callbackFn);
        },

        loadhtml: function (container, urlraw, callback) {
            var urlselector = (urlraw).split(" ", 1);
            var url = urlselector[0];
            var selector = urlraw.substring(urlraw.indexOf(' ') + 1, urlraw.length);
            private.container = container;
            private.callback = callback;
            private.jsonpcall('DoTheThing', ['downloadurl', escape(url)],
                function (msg) {
                    // gets the contents of the Html in the 'msg'
                    // todo: apply selector
                    private.container.html(msg);
                    if ($.isFunction(private.callback)) {
                        private.callback();
                    }
                });
        },

        // wire widget after it's loaded
        ContactUs_Init: function () {

            // this function is OnClick event for the link
            $('button#submitContactUs').click(function () {
                var btn = $(this);
                var widget = $('div#contactUsWidget');
                widget.find('*').addClass("processing");
                widget.find("span#error").html("");
                var arg1 = widget.find('input#txtArg1')[0].value;
                var arg2 = widget.find('input#txtArg2')[0].value;
                private.jsonpcall("Calculator2/Service.svc/Sum",
                    ["arg1", arg1, "arg2", arg2],
                    function (result) {
                        if (result.Error == null) {
                            widget.find("span#result").html(result.Value);
                        } else {
                            widget.find("span#result").html("Error");
                            widget.find("span#error").html(result.Error);
                        }
                        widget.find('*').removeClass("processing");
                    });
                return false;
            });

            // initializing the widget.
            // nothing for now.
        }
    };

    var public = {

        // load widget into 'container' from 'host'
        ContactUs: function (container, host) {
            private.host = host;
            private.loadhtml(container, 'http://' + private.host + '/Widgets/ContactUs',
                private.ContactUs_Init);
        }
    }

    return public;
}();

