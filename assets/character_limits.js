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
		
		DOM: {
			h1: null
		},
		
		init: function(fields) {
			
			var self = this;
			
			// Rework DOM structure
			this.DOM.h1 = $('h1:first');
			// Configure URL parameters for context
			var root = this.DOM.h1.find('a').attr('href');
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
							
							var value = input.val();
							var current_length = value.length;
							
							if (current_length > max_length) {
								current_length = max_length;
								input.val(value.substr(0, current_length));
							}
							
							if (input.is('input')) input.attr('maxlength', max_length);
							
							var label = $('label > i', this);
							
							if (!label.length) {
								input.before('<i></i>');
								label = $('label > i', this);
							}
							
							label.append(' (<span class="current-length">'+current_length+'</span>/<span class="max-length">'+max_length+'</span> characters)');
							
							var current_value_span = label.find('span.current-length');
							
							input.keyup(function() {
								
								var value = $(this).val();
								var current_length = value.length;
								
								if (current_length > max_length) {
									current_length = max_length;
									input.val(value.substr(0, current_length));
								}
								
								current_value_span.text(current_length);
								
							});
							
						};
						
					});
					
				}
			}
			
		},
		
		stripMarkdown: function(string) {
			return string.length;
		}
		
	}
	
})(jQuery.noConflict());

jQuery(document).ready(function() {
	
	CharacterLimits.init([
		{'articles': { 'title': 10, 'body': 20 }},
		{'comments': { 'author': 10, 'email': 200 }}
	]);
	
});