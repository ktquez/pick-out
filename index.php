<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title> Pickout - Cool effect in select form</title>

	<style>
		*{padding:0;margin:0;}
		body {
			font-family: Arial, Calibri;
		}

		.content {
			margin:50px auto 0;
			width:300px;
		}

		h2 {
			margin-bottom:10px;
		}

		label {
			width:100%;
			float:left;
			margin-bottom:10px;
		}

		.field-input, select{
			width:calc(100% - 20px);
			float:left;
			padding:10px;
			font-family:inherit;
		}		

	</style>
	<link rel="stylesheet" href="./dist/pickout.min.css">
</head>
<body>
	
	<div class="content -bg">
		
		<form action="#" method="post">
			<h2>
			FORMULÁRIO
			</h2>
			<label for="name">
				<input type="text" name="name" id="name" class="field-input">			
			</label>
			<label for="city">
				<select name="city" id="city" class="city pickout" placeholder="Selecione uma cidade">
					<option data-icon="&spades;" value="recife">recife</option>
					<option data-icon="&clubs;" value="natal">natal</option>
					<option data-icon="&hearts;" value="salvador">salvador</option>
					<option selected data-icon="&diams;" value="sp">São Paulo</option>
					<option data-icon="&#9786;" value="rio de janeiro">Rio de Janeiro</option>
					<option data-icon="&#9792;" value="ceara">Ceará</option>
					<option data-icon="&#9794;" value="minas gerais">Minas Gerais</option>
				</select>			
			</label>
			<label for="name2">
				<input type="text" name="name2" id="name2" class="field-input">			
			</label>
			<label for="state">
				<select name="state" id="state" class="state pickout" placeholder="Selecione um estado">
					<option value="pe">Pernambuco</option>
					<option value="pb">Paraiba</option>
					<option value="ba">Bahia</option>
					<option value="sp">São Paulo</option>
					<option value="rj">Rio de Janeiro</option>
				</select>			
			</label>	
			<button type="submit">
				ENVIAR
			</button>		
		</form>

	</div>
	
	<script src="./dist/pickout.min.js"></script>
	<script>

		// Preparar o select
		pickout.to('.pickout');

		// Caso o valor já venha do servidor, já atribui a seleção automaticamente
		pickout.updated('.city');
		
		
	</script>
</body>
</html>