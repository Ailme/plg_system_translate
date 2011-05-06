google.load("language", "1");
var translate =  {
	enableGoogle : 0,
    fromLang : 'ru',
    toLang : 'en',
    tmp : '',

	trim : function(v)
	{
		var s = v.toLowerCase();
		s = s.replace(/[^a-zа-я0-9\-]/g, "-");
		s = s.replace(/(\-|\s)+/g, "-");
		return s;
	},

	transliterate: function (v)
	{
		if (v.length == 0) return "";
		ru = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
		en = Array(
			'a',	'b',	'v',	'g',	'd',
			'e',	'e',	'zh',	'z',	'i',
			'y',	'k',	'l',	'm',	'n',
			'o',	'p',	'r',	's',	't',
			'u',	'f',	'h',	'ts',	'ch',
			'sh',	'sch',	'',		'y',	'',
			'e',	'yu',	'ya'
		);

		var tmp_str = [];
		for(var i = 0, l = v.length; i < l; i++) {
			var s = v.charAt(i), n = ru.indexOf(s);
			if(n >= 0) {
				tmp_str[tmp_str.length] = en[n];
			} else {
				tmp_str[tmp_str.length] = s;
			}
		}
		return tmp_str.join("");
	},

	gTransliterate: function(v, callback)
	{
		var t = this;
		var v1 = v;
		google.language.translate(v, t.fromLang, t.toLang, function(result) {
			if (result.translation) {
				var v = result.translation;
				v = t.trim(v);
			} else {
				v = t.transliterate(v1);
			}
			if (callback) callback(v);
		});
	}
};

function getLang(lang)
{
	if (lang.search('russian') >= 0) return 'ru';
	if (lang.search('french') >= 0) return 'fr';
	if (lang.search('english') >= 0) return 'en';
}

(function($, translate){

	$(function(){
		var $alias = $('input[name=alias]').eq(0);
		var $title = $('input[name=title], input[name=name], input[name=caption]').eq(0);
		if ($alias.length == 1 && $title.length == 1) {
			$title.bind('blur', function(e){
				var value = $(this).val();
				if (translate.enableGoogle) {
					translate.gTransliterate(value, function(v){
						$alias.val(v);
					});
				} else {
					var s = translate.trim(value);
					s = translate.transliterate(s);
					$alias.val(s);
				}
			});
		}

		var $refField_alias = $('input[name=refField_alias]').eq(0);
		var $refField_name = $('input[name=refField_name], input[name=refField_title]').eq(0);
		var $language_id = $('#language_id').eq(0);
		var $fromLang = $('.modtranslate img').eq(0);

		if ($refField_name.length == 1 && $language_id.length == 1 && $fromLang.length == 1) {
			var toLang = $(':selected', $language_id).text().toLowerCase();
			var fromLang = $fromLang.attr('title').toLowerCase();
			var original_value_name = $('#original_value_name, #original_value_title').eq(0).text();

			translate.fromLang = getLang(fromLang);
			translate.toLang = getLang(toLang);

			function translateName(str)
			{
				translate.gTransliterate(str, function(v){
					$refField_name.val(v);
					v = translate.trim(v);
					v = translate.transliterate(v);
					$refField_alias.val(v);
				});
			}

			if ($refField_name.val().length == 0)
	            translateName(original_value_name);

			$language_id.bind('change', function(e){
				var lang = $(':selected', this).text().toLowerCase();
				translate.toLang = getLang(lang);
	            translateName(original_value_name);
			});

			$refField_name.bind('blur', function(e){
				var value = $(this).val();
 				var s = translate.trim(value);
				s = translate.transliterate(s);
				$refField_alias.val(s);
			});
		}
	});

})(jQuery, translate);