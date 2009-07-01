<?php
	
	class Extension_Character_Limits extends Extension {
		
		public function about() {
			return array(
				'name'			=> 'Character Limits',
				'version'		=> '0.01',
				'release-date'	=> '2009-06-30',
				'author'		=> array(
					'name'			=> 'Nick Dunn',
					'website'		=> 'http://airlock.com',
					'email'			=> 'nick.dunn@airlock.com'
				),
				'description'	=> 'Bastardise the backend.'
			);
		}
		
		public function getSubscribedDelegates() {
			return array(
				array(
					'page'		=> '/backend/',
					'delegate'	=> 'InitaliseAdminPageHead',
					'callback'	=> 'initaliseAdminPageHead'
				)
			);
		}
		
	/*-------------------------------------------------------------------------
		Delegates:
	-------------------------------------------------------------------------*/
		
		public function initaliseAdminPageHead($context) {
			$page = $context['parent']->Page;
			
			$page->addStylesheetToHead(URL . '/extensions/character_limits/assets/character_limits.css', 'screen', 99999991);
			$page->addScriptToHead(URL . '/extensions/character_limits/assets/character_limits.js', 99999992);
			
		}
	}
	
?>