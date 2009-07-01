var CharacterLimits;

(function($) {
	
	CharacterLimits = {
		
		URL: {
			root: null,
			symphony_root: null,
			page: null,
			section: null,
			mode: null,
		},
		
		init: function(fields) {
			
			var self = this;
			
			// Configure URL parameters for context
			var root = $('h1:first a').attr('href');
			var url = window.location.href.replace(root, '').split('/');
			
			this.URL.root = root;
			this.URL.symphony_root = root + 'symphony/';
			this.URL.page = url[1];
			
			switch(this.URL.page) {
				case 'publish':
					this.URL.section = url[2];
					if (url[3] && url[3].indexOf('?') == -1) {
						this.URL.mode = url[3];
					} else {
						this.URL.mode = 'index';
					};					
				break;				
			}

			if (this.URL.mode == 'new' || this.URL.mode == 'edit') {
				
				var section = this.URL.section;
				
				for (field in fields) {
					
					if (!fields[field][section]) continue;
					
					$('div.field').each(function() {
						
						var input = $('label input, label textarea', this);
						var name = input.attr('name');
						if (input.length) name = name.replace('fields[', '').replace(']','');
						
						if (input.length && fields[field][section][name]) {
							
							var max_length = fields[field][section][name];
							
							// is this markitup (markdown) enabled?
							var markitup = $(this).find('div.markItUp');
							var markdown = false;
							if (markitup.length) markdown = true;
							
							var value = input.val();
							var current_length = self.plainTextLength(value, markdown);
							
							// if existing value too long?
							if (current_length > max_length) {
								current_length = max_length;
								input.val(value.substr(0, current_length));
							}
							
							// set maxlength for Text Input fields
							if (input.is('input')) input.attr('maxlength', max_length);
							
							var label = $('label > i', this);
							
							// add <i> label if none exists
							if (!label.length) {
								input.before('<i></i>');
								label = $('label > i', this);
							}
							
							// move label down for markItUp fields
							if (markdown) {
								label.css('top', '20px');
							}
							
							label.append(' (<span class="current-length">'+current_length+'</span>/<span class="max-length">'+max_length+'</span> characters)');
							
							var current_value_span = label.find('span.current-length');
							
							// highlight limit if reached with initial value
							if (current_length == max_length) {
								label.addClass('maxlength-limit');
							} else {
								label.removeClass('maxlength-limit');
							}
							
							input.keyup(function() {
								
								var value = $(this).val();
								var current_length = self.plainTextLength(value, markdown);
								
								// check length and trim
								if (current_length > max_length) {
									current_length = max_length;
									input.val(value.substr(0, current_length));
								}
								
								// highlight limit if reached
								if (current_length == max_length) {
									label.addClass('maxlength-limit');
								} else {
									label.removeClass('maxlength-limit');
								}
								
								current_value_span.text(current_length);
								
							});
							
						};
						
					});
					
				}
			}
			
		},
		
		plainTextLength: function(string, markdown) {
			
			string = string + '';
			
			if (markdown) {
				
				string = string.replace(/(=){2,}/g, ''); // h1
				string = string.replace(/(-){2,}/g, ''); // h2
				string = string.replace(/(#){2,}/g, ''); // h3+

				// FIXME: \w matches words, not any punctuation inside bold. This will not be replaced: **what!**
				string = string.replace(/\*\*(\w+)\*\*/g, '$1'); // bold
				string = string.replace(/_(\w+)_/g, '$1'); // italic

				// FIX ME: .+ is probably too liberal, use a more rbust method, perhaps checking for line break at the end too?
				string = string.replace(/\n- (.+)/g, '$1'); // list items

				string = string.replace(/\n> (.+)/g, '$1'); // block quotes

				string = string.replace(/(!?)(\[\]|\[(.+?)\])\((.*)\)/g, ''); // images and links

				string = string.replace(/\n/g, ''); // line breaks
				string = string.replace(/\t/g, ''); // tabs

				string = string.replace(/\s{2,}/g, ''); // double+ spaces
				string = string.replace(/(\s)$/, ''); // trailing space
			}
			
			//console.log(string);
			
			return string.length;
		}
		
	}
	
})(jQuery.noConflict());

jQuery(document).ready(function() {
	
	CharacterLimits.init([
		{ 'articles': { 'title': 10, 'body': 500 }},
		{ 'comments': { 'author': 10, 'email': 200 }}
	]);
	
});