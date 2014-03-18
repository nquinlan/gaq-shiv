(function () {
	var
		pushAction = function (action) {
			try {
				ga('send', action);
			} catch (e) {
				throw "Google Analytics (Analytics.js) must be installed for gaq-shiv to work";
			}
		}
	,	trackEvent = function (element) {
			var action = {
				'hitType': 'event'
			};

			var keys = ["eventCategory", "eventAction", "eventLabel", "eventValue", "nonInteraction"];
			
			for(var i = 0; i < keys.length; i++){
				if(typeof element[i + 1] !== "undefined") {
					action[keys[i]] = element[i + 1];
				}
			}

			return action;
		}
	;

	var
		InvalidAction = function (element) {
			this.name = "InvalidAction";
			this.message = "The element pushed to _gaq was not an array of the correct length.";
			this.action = element;
		}
	,	UnhandledAction = function (element) {
			this.name = "UnhandledAction";
			this.message = "An unknown action was specified, and was not tracked.";
			this.remediation = "File an issue at https://github.com/nquinlan/gaq-shiv/issues with the entire contents of this message, so that this may be fixed in the future";
			this.action = element;
		}
	;

	var shiv = {};

	shiv.push = function () {
		var args = arguments;
		for(var i = 0; i < args.length; i++){
			var element = args[i];

			if(!element[0]) {
				throw new InvalidAction(element);
				continue;
			}

			switch (element[0]) {
				case "_trackEvent":
					pushAction( trackEvent(element) );
					break;
				default:
					throw new UnhandledAction(element);
					break;
			}
		}
	};

	if(typeof _gaq === "undefined"){
		_gaq = shiv;
	}
})();