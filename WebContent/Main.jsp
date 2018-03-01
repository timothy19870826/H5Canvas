<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script type="text/javascript" src="Scripts/BCNewCore.js"></script>
<title>Insert title here</title>
</head>
<body>
	<canvas id="main" onmousedown="" >Here is canvas</canvas>
	<script type="text/javascript" src="js/require.js" defer async data-main="js/main"></script>
	<script type="text/javascript">
		var core = new BCJSCore();
		if (core.initCanvas(500, 800)){
			console.log("Canvas init success.");
		}
	</script>
</body>
</html>