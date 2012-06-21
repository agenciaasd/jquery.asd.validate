<?php

sleep(5);
foreach($_POST as $chave => $valor)
{
	echo "Chave: {$chave} = '{$valor}';<br />";
}