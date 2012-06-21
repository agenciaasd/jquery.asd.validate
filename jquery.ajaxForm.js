/*  
 * jQuery Ajato v1.0
 *
 * Copyright ©2010 - Direitos reservados
 * Criado por Eric Platas
 * http://ericplatas.com.br
 *
 * Este plugin foi desenvolvido para simplificar a criação de formularios complexos,
 * que precisem de varios tipos de validação, que se fossem realizadas do lado servidor
 * tornariam as aplicações lentas e desperdiçariam a banda do servidor.
 * Ao mesmo tempo ele torna simples e pratico o uso de ajax configurando 
 * tudo automaticamente sendo que a configuração manual é opcional ou emcaso de exceção.
 *
 * Caso encontre alguma falha ou limitação, ou tenha alguma sujestão de recurso
 * para adicionar ao plugin, ou de melhora no funcionamento da versão atual,
 * entre em contato no email contato@ericplatas.com.br
 * 
 */


(function($) {
$.ajaxForm = {
	// 
	options: {
		formId: '',
		requerTodos: true,
		idIgualName: false,
		imprimeErro: true,
		alertaErro: true,
		erroPorCampo: true,
		listaErros: true,
		msgErro: '<p class=\"msg_erro_final\">Preencha o formulario corretamente!</p>',
		iconCarregando: $('<span class="destaque">carregando, por favor espere...</span><br /><img src="images/preloader4.gif" class="icon" />'),
		destino: '',
		jqueryui: false
	},
	elements: []
};
	
	$.fn.ajaxForm = function(options){ 
	
		options = $.extend($.ajaxForm.options, options);
		
		$(this).submit(function(e){
			e.preventDefault();
			
			$(".msg_erro, .msg_erro_lista, .msg_erro_final").remove();
						
			/********** Variaveis ***********************************************************/
			
			var erros = 0;
			var exibeErro = "Erro(s) encontrado(s):\n";
			var exibeErroHtml = "<p class=\"msg_erro_lista\">Erro(s) encontrado(s):</p>";
			
			// Se a opçao formId nao for expecificada ele seleciona
			// o id do form, se o form nao tem id ele seleciona o
			// name do form e cria um id igual ao name
			if(options.formId === ''){
				if($(this).attr("id") == ''){
					var id_form = $(this).attr("name");
					$(this).attr("id", id_form);
				}
				options.formId = $(this).attr("id");
			}
			
			// Se a opçao destino nao for expecificada ele seleciona 
			// o action do form e define como destino
			if(options.destino === ''){
				options.destino = $(this).attr("action");
			}
			
			/////////////////////////////////////////////////////
			//     Funçao para validaçao dos dados do form     //
			/////////////////////////////////////////////////////
			
			var validaForm = function(id){
							
				var tipo  = $("#" + id).attr("content");
				var valor = $("#" + id).val();
				
				switch(tipo){
					default:
					if(options.requerTodos){
						if(valor == ''){
							erros++;
							if(options.erroPorCampo == true){
								$("#" + id).parent().append("<p class=\"msg_erro\">Preencha este campo!</p>").hide().slideDown(200);
							}
						}else{
							return true;
						}
					}else{
						return true;
					}
					break;
					
					// Campo nao pode ser nulo
					case "requerido":
					if(valor == ''){
						erros++;
						if(options.erroPorCampo == true){
							$("<p class=\"msg_erro\">Preencha este campo!</p>").insertAfter("#" + id).hide().slideDown(200);
						}
					}else{
						return true;
					}
					break;
					
					// Verifica se algum valor foi selecionado no combobox
					case "combobox":
					if(valor == null || valor == ''){
						erros++;
						if(options.erroPorCampo == true){
							$("#" + id).parent().append("<p class=\"msg_erro\">Selecione um valor!</p>").hide().slideDown(200);
						}
						
						if(options.listaErros == true){
							exibeErro += "Selecione um valor!\n";
							exibeErroHtml += "<p class=\"msg_erro_lista\">Selecione um valor!</p>";
						}
					}else{
						return true;
					}
					break;
					
					//Campo de e-mail pode ser .com, .com.br, .com.us, .net, etc...
					case "email":
					var padrao = /^([\w-]+(\.[\w-]+)*)@(( [\w-]+\.)*\w[\w-]{0,66}\.([a-z]{3,6})?)$/i;
					var padrao_br = /^([\w-]+(\.[\w-]+)*)@(( [\w-]+\.)*\w[\w-]{0,66}\.([a-z]{2,6}(\.[a-z]{2}))?)$/i;
					if(padrao.test(valor)){
						return true;
					}else if(padrao_br.test(valor)){
						return true;
					}else{
						erros++;
						if(options.erroPorCampo == true){
							$("<p class=\"msg_erro\">E-mail inv&aacute;lido!</p>").insertAfter("#" + id).hide().slideDown(200);
						}
						
						if(options.listaErros == true){
							exibeErro += "E-mail invalido!\n";
							exibeErroHtml += "<p class=\"msg_erro_lista\">E-mail inv&aacute;lido!</p>";
						}
					}
					break;
					
					// Campo nome de usuario deve conter letras ou numeros sem espaço (case insensitive).
					case "nome_usuario":
					var padrao = /^(([a-z]{1})+([\w-]{3,20})?)$/i;
					if(padrao.test(valor)){
						return true;
					}else{
						erros++;
						if(options.erroPorCampo == true){
							$("<p class=\"msg_erro\">O nome de usuario deve:<ul class=\"msg_erro\"><li>Ter de 4 &agrave; 20 caracteres (letras ou numeros);</li><li>Iniciar com uma letra;</li></p>").insertAfter("#" + id).hide().slideDown(200);
						}
						
						if(options.listaErros == true){
							exibeErro += "O nome de usuario deve:\n- Ter de 4 a 20 caracteres (letras ou numeros);\n- Iniciar com uma letra;\n";
							exibeErroHtml += "<p class=\"msg_erro_lista\">O nome de usuario deve:<ul class=\"msg_erro\"><li>Ter de 4 &agrave; 20 caracteres (letras ou numeros);</li><li>Iniciar com uma letra;</li></ul></p>";
						}
					}
					break;
					
					// Campo senha deve ter entre 4 e 12 caracteres, letras e numeros (case insensitive).
					case "senha":
					var padrao = /^([\w]{4,12})$/i;
					if(padrao.test(valor)){
						return true;
					} else {
						erros++;
						if(options.erroPorCampo == true){
							$("<p class=\"msg_erro\">A senha deve ter entre 4 e 12 caracteres, letras e numeros!</p>").insertAfter("#" + id).hide().slideDown(200);
						}
						
						if(options.listaErros == true){
							exibeErro += "A senha deve ter entre 4 e 12 caracteres, letras e numeros!\n";
							exibeErroHtml += "<p class=\"msg_erro_lista\">A senha deve ter entre 4 e 12 caracteres, letras e numeros!;</p>";
						}
					}
					break;
					
					// Campo senha_igual deve ter valor igual ao campo senha (case insensitive).
					case "senha_igual":
					var senha = $("input[content=senha]").val();
					if(valor === senha){
						return true;
					} else {
						erros++;
						if(options.erroPorCampo == true){
							$("<p class=\"msg_erro\">As senhas devem coincidir!</p>").insertAfter("#" + id).hide().slideDown(200);
						}
						
						if(options.listaErros == true){
							exibeErro += "As senhas devem coincidir!\n";
							exibeErroHtml += "<p class=\"msg_erro_lista\">As senhas devem coincidir!;</p>";
						}
					}
					break;
					
					
					
					// Campo nome pode ser simples, ex: Carlos ou composto, ex: Carlos Eduardo.
					// Deve conter apenas letras sempre começando com maiuscula (case sensitive).
					case "nome":
					var padrao = /^(([A-Z]{1})+(.{2,19})?)$/;
					var padrao_composto = /^(([A-Z]{1})+(.{2,19})+(\s[A-Z]{1})+(.{2,19})?)$/;
					if(padrao.test(valor)){
						return true;
					}else if(padrao_composto.test(valor)){
						return true;
					}else{
						erros++;
						if(options.erroPorCampo == true){
							$("<p class=\"msg_erro\">O nome deve:<ul class=\"msg_erro\"><li>Ter de 4 e 20 letras;</li><li>Iniciar com letra mai&uacute;scula;</li></ul></p>").insertAfter("#" + id).hide().slideDown(200);
						}
						
						if(options.listaErros == true){
							exibeErro += "O nome deve:\n- Ter de 4 e 20 letras;\n- Iniciar com letra maiuscula\n";
							exibeErroHtml += "<p class=\"msg_erro_lista\">O nome deve:<ul class=\"msg_erro\"><li>Ter de 4 e 20 letras;</li><li>Iniciar com letra mai&uacute;scula;</li></ul></p>";
						}
					}
					break;
					
					case "sobrenome":
					var padrao = /^(([A-Z]{1})+([a-z]{2,19})?)$/;
					var padrao_composto = /^(([A-Z]{1})+([a-z]{2,19})+(\s[A-Z]{1})+([a-z]{2,19})?)$/;
					if(padrao.test(valor)){
						return true;
					}else if(padrao_composto.test(valor)){
						return true;
					}else{
						erros++;
						if(options.erroPorCampo == true){
							$("<p class=\"msg_erro\">O sobrenome deve:<ul class=\"msg_erro\"><li>Ter de 4 e 20 letras;</li><li>Iniciar com letra mai&uacute;scula;</li></p>").insertAfter("#" + id).hide().slideDown(200);
						}
						
						if(options.listaErros == true){
							exibeErro += "O sobrenome deve:\n- Ter de 4 e 20 letras;\n- Iniciar com letra maiuscula\n";
							exibeErroHtml += "<p class=\"msg_erro_lista\">O sobrenome deve:<ul class=\"msg_erro\"><li>Ter de 4 e 20 letras;</li><li>Iniciar com letra mai&uacute;scula;</li></ul></p>";
						}
					}
					break;
					
					// Campo de cep com 5 numeros + "-" + 3 numeros ou com 8 numeros
					case "cep":
					var padrao = /^(([0-9]{5})+([-]?)+([0-9]{3}))$/;
					if(padrao.test(valor)){
						return true;
					}else{
						erros++;
						if(options.erroPorCampo == true){
							$("<p class=\"msg_erro\">Digite um cep v&aacute;lido!</p>").insertAfter("#" + id).hide().slideDown(200);
						}
						
						if(options.listaErros == true){
							exibeErro += "Digite um cep valido!\n";
							exibeErroHtml += "<p class=\"msg_erro_lista\">Digite um cep v&aacute;lido!</p>";
						}
					}
					break;
					
					// Campo de telefone com/sem digitos no começo, com/sem "-" no meio.
					case "fone":
					var padrao = /^((([(][0-9]{2,3}[)]([ ]?))?)+([0-9]{4})+([-]?)+([0-9]{4}))$/;
					if(padrao.test(valor)){
						return true;
					}else{
						erros++;
						if(options.erroPorCampo == true){
							$("<p class=\"msg_erro\">Digite um telefone v&aacute;lido!</p>").insertAfter("#" + id).hide().slideDown(200);
						}
						
						if(options.listaErros == true){
							exibeErro += "Digite um telefone valido!\n";
							exibeErroHtml += "<p class=\"msg_erro_lista\">Digite um telefone v&aacute;lido!</p>";
						}
					}
					break;
					
					case "url":
					var padrao = /^(http\:\/{2})?(([\w-]{3,20})+\.)?(([\w-]+\.)*[\w-]+\.[a-z]{2,6}?\.[a-z]{2}?(\057)?(([\w-]+)*\057*)*(\.[\w-]{2,3})?)$/i;
					if(padrao.test(valor)){
						return true;
					}else{
						erros++;
						if(options.erroPorCampo == true){
							$("<p class=\"msg_erro\">URL inv&aacute;lida!</p>").insertAfter("#" + id).hide().slideDown(200);
						}
						
						if(options.listaErros == true){
							exibeErro += "URL invalida!\n";
							exibeErroHtml += "<p class=\"msg_erro_lista\">URL inv&aacute;lida!</p>";
						}
					}
					break;
					
					
					case "rg":
					var padrao = /^(([0-9]{2})\.([0-9]{3})\.([0-9]{3})[-]([0-9]{1}))$/;
					if(padrao.test(valor)){
						return true;
					}else{
						erros++;
						if(options.erroPorCampo == true){
							$("<p class=\"msg_erro\">Numero de RG inv&aacute;lido!</p>").insertAfter("#" + id).hide().slideDown(200);
						}
						
						if(options.listaErros == true){
							exibeErro += "Numero de RG invalido!\n";
							exibeErroHtml += "<p class=\"msg_erro_lista\">Numero de RG inv&aacute;lido!</p>";
						}
					}
					break;
					
					// Campo de CPF com pontos separando
					case "cpf":
					var padrao = /^(([0-9]{3})\.([0-9]{3})\.([0-9]{3})[-]([0-9]{2}))$/;
					if(padrao.test(valor)){
						return true;
					}else{
						erros++;
						if(options.erroPorCampo == true){
							$("<p class=\"msg_erro\">Numero de CPF inv&aacute;lido!</p>").insertAfter("#" + id).hide().slideDown(200);
						}
						
						if(options.listaErros == true){
							exibeErro += "Numero de CPF invalido!\n";
							exibeErroHtml += "<p class=\"msg_erro_lista\">Numero de CPF inv&aacute;lido!</p>";
						}
					}
					break;
	
				}
			};		
			
			$("#" + options.formId + " input[type=text], #" + options.formId + " select, #" + options.formId + " input[type=password]").each(function(i){
				if(options.idIgualName){
					var novo_id = $(this).attr("name");
					$(this).attr("id", novo_id);
				}
				var id_input  = $(this).attr("id");
				
				validaForm(id_input);
			});
			
			if(erros === 0){
				e.preventDefault();
				var serializeDados = $(this).serialize();
				
				$.ajax({
					url: options.destino,
					dataType: 'html',
					type: 'POST',
					data: serializeDados,
					cache: false,
					beforeSend: function(){
						$('#rst').html(options.iconCarregando);
					},
					complete: function(){
						$(iconCarregando).remove();
					},
					success: function(data, textStatus){
						$('#rst').html('<p>' + data + '</p>');
					},
					error: function(xhr,er){
						$('#rst').html('<p class="destaque">Error ' + xhr.status + ' - ' + xhr.statusText + '<br />Tipo de erro: ' + er + '</p>');
					}
				});
			} else {
				exibeErro     += "Preencha todos os campos sinalizados!\n";
				exibeErroHtml += "<p class=\"msg_erro_lista\">Preencha todos os campos sinalizados!</p>";
				if(options.alertaErro == true){
					if(options.jqueryui == false){
						alert(exibeErro);
					} else {
						
						$("#rst").html("<div id=\"form_erro\" title=\"Erro\" class=\"ui-corner-top\">" + exibeErroHtml + "</div>");
						$("#form_erro").dialog({
							show: "clip",
							hide: "clip",
							modal: true,
							buttons: {
								Ok: function() {
									$( this ).dialog( "close" );
								}
							}
						});
					}
				}
				
				if(options.erroPorCampo == true){
					$(this).append(options.msgErro);
				}
				
				if(options.imprimeErro == true){
					$(this).append(exibeErroHtml);
				}
			}
		});
	};
})(jQuery);