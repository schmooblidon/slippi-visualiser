
//  	  aS  : <frames> <shapes> point point </shapes> </frames>
//actionState : [ [new Int16Array([points]),new Int16Array([points])] , [ ] ]

countArray = 0;
countNum = 0;
function bracketCount(){
	var keys = Object.keys(animations[0]);

	// for each action state
	for (var i=0;i<keys.length;i++){

		// for each frame
		for (var j=0;j<animations[0][keys[i]].length;j++){

			// for each point / curve
			for (var k=0;k<animations[0][keys[i]][j].length;k++){
				countArray++;
				
				// for each number
				for (var m=0;m<animations[0][keys[i]][j][k].length;m++){
					countNum++;
				}

			}

		}

	}
	$("#anims").empty().append(countArray+" "+countNum);

}
function parseAnimations(){

	var keys = Object.keys(animations[0]);
	var shapeCount = 0;

	// for each action state
	for (var i=0;i<keys.length;i++){

		$("#anims").append(keys[i]+":[");

		// for each frame
		for (var j=0;j<animations[0][keys[i]].length;j++){

			$("#anims").append("[");

			shapeCount = 0;
			// for each point / curve
			for (var k=0;k<animations[0][keys[i]][j].length;k++){

				// if a start
				if (animations[0][keys[i]][j][k].length == 2){
					if (shapeCount > 0){
						$("#anims").append("]),");
					}
					$("#anims").append("new Int16Array([");
					shapeCount++;
				}

				// for each number
				for (var m=0;m<animations[0][keys[i]][j][k].length;m++){

					$("#anims").append(animations[0][keys[i]][j][k][m]);

					// if not the last number in the last point/curve
					if (k != animations[0][keys[i]][j].length - 1){
						$("#anims").append(",");
					}
					else if (m != animations[0][keys[i]][j][k].length - 1){
						$("#anims").append(",");
					}

				}

			}

			$("#anims").append("])]");

			// if not the last frame
			if (j != animations[0][keys[i]].length - 1){
				$("#anims").append(",");
			}

		}

		$("#anims").append("]");

		// if not the last action state
		if (i != keys.length - 1){
			$("#anims").append(",\n");
		}
	}
	

}


function intArrayTest(){
	var A = new Int16Array([1,3,5,7,9,11,13,4199293495512]);
	console.log(A);
	for (var i=0;i<A.length;i++){
		$("#anims").append(A[i]+" ");
	}
}


$(document).ready(function(){
	parseAnimations();
	//bracketCount();
	//intArrayTest();
})