$(document).ready(function(){
		
    //svg
    let svg = d3.select("body").select("div.stairViz").append("svg")
				.attr("width","100%")
				.attr("height","100%");
				
	var div = d3.select("body").select("div.stairViz").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);			
     
     d3.json("./data/labelleddata.json", function(error,datao) {
        if (error) {  //If error is not null, something went wrong.
            console.log(error);  //Log the error.
        } else {  
		d3.json("./data/edge.json", function(error, edge){
			if(error) {
				console.log(error);  
			}
			else{
			edge.sort(function(a, b) {			//sort in asending order of sourceid
				return (a.sourceid) - (b.sourceid);
			});
			var temp_holder= [];
			var max_x = $(".stairViz").width() - 10;
			var max_y = $(".stairViz").height() -10;
			var paragraph= [];
			var sentence= [];
			var i=0;
			var j=0;
			var k=0;
			var min_text;
			var max_text;
			for(i =0;i<datao.length;i++){
				paragraph[i]= datao[i];	
				paragraph[i].index=i;
				for(j=0;j<paragraph[i].length;j++){	
					var len= paragraph[i][j].length;
					sentence[j]=paragraph[i][j];
					for(k=0;k < len;k++){
						var id=paragraph[i][j][k].Id
						temp_holder[id] = paragraph[i][j][k];
					}
				}
			}	
			var group = svg.append("g").attr("class","group");
			for(i =0;i<datao.length;i++){		//remove when get id from html div
				var rect_w = max_x/(datao.length);
				var rect_h = max_y/(datao.length);
				
				var para_rect = group
							.append("rect")
							.attr("index",paragraph[i].index)
							.attr("x", function(){  paragraph[i].x = rect_w*i;
													return rect_w*i;})
							.attr("y",function(){ paragraph[i].y = rect_h*i;
													return rect_h*i;})
							.attr("width", rect_w)
							.attr("height", rect_h)
							.style("fill","yellow")
							.attr("stroke-width","1")
							.on("click",function(){

				var index = d3.select(this).attr("index");
				console.log(index);
				para_rect.transition()
						.duration(750)
						.attr("x", function() { return paragraph[index].x })
						.attr("y", function() { return paragraph[index].y; })
						.attr("width", function() { return rect_w})
						.attr("height", function() { return rect_h; });
				});
				
				
				var sentence_gr = group.append("g");	
				var senrect_w=0;
				var senrect_h=0;
				for(j=0;j<paragraph[i].length;j++){	
				if(i==0){
					senrect_w = rect_w/(paragraph[i].length);
					senrect_h = rect_h/(paragraph[i].length);   
					}
					else{
					senrect_w = (rect_w*i)/(paragraph[i].length);
					senrect_h = (rect_h*i)/(paragraph[i].length);   
					}
					var sent_rect = sentence_gr
							.append("rect")
							.attr("index1",i)
							.attr("index2",j)
							.attr("x", function(){  paragraph[i][j].x = (rect_w*i) + (senrect_w*j);
													return paragraph[i][j].x;})
							.attr("y",function(){ paragraph[i][j].y = (rect_h*i)+ (senrect_h*j);
												return paragraph[i][j].y;})
							.attr("width", senrect_w)
							.attr("height", senrect_h)
							.style("fill","green")
							.attr("stroke-width","1")
							.on("click",function(){
									var index1 = d3.select(this).attr("index1");
									var index2 = d3.select(this).attr("index2");
									sent_rect.transition()
												.duration(750)
												.attr("x", function() { return paragraph[index1][index2].x })
												.attr("y", function() { return paragraph[index1][index2].y; })
												.attr("width", function() { return senrect_w})
												.attr("height", function() { return senrect_h; });
							});	
							var word_gr = group.append("g").attr("class","word");	
							var wrdrect_w=0;
							var wrdrect_h=0;
							for(k=0;k<paragraph[i][j].length;k++){	
									min_text = paragraph[i][j][0];
									max_text = paragraph[i][j][paragraph[i][j].length-1];	
									wrdrect_w = (senrect_w)/(paragraph[i][j].length);
									wrdrect_h = (senrect_h)/(paragraph[i][j].length);   
									var id=paragraph[i][j][k].Id;
									var wrd_rect = word_gr	
												.append("rect")
												.attr("word",temp_holder[id].word)
												.attr("w",wrdrect_w)
												.attr("h",wrdrect_h)
												.attr("x", function(){  temp_holder[id].x = (rect_w*i)+(senrect_w*j) + (wrdrect_w*k);
																	return temp_holder[id].x;})
												.attr("y",function(){ temp_holder[id].y = (rect_h*i)+(senrect_h*j)+ (wrdrect_h*k);
																	return temp_holder[id].y;})
												.attr("width", wrdrect_w)
												.attr("height", wrdrect_h)
												.style("fill","white")
												.attr("stroke-width","1")
												.on("mouseover",function(){
							var word = d3.select(this).attr("word");
							div.transition()
								.duration(200)
								.style("opacity", .9);
							div.html("Text: "+ word)
							.style("left",d3.event.pageX +"px")
								.style("top", d3.event.pageY - 28 +"px")
								.style("color", "white");})
							.on("mouseout",funcmouseout);
				/*to enable viewing the text relations*/	
				wrd_rect.on('mouseenter', function() {
								var word = d3.select(this).attr("word");
								d3.select( this )
									.transition()
									.attr( 'width', senrect_w ).attr( 'height', senrect_h )
									.attr("fill","blue").append("g").append("text").text(word).style("color","black").attr("transform",function(){console.log("here"); return "translate(" +senrect/2 +","+ senrect_h/2+ ")"});
							})
							.on( 'mouseleave', function() {
								var w=d3.select(this).attr("w");
								var h=d3.select(this).attr("h");
								d3.select( this )
									.transition()
									.attr( 'width', w ).attr( 'height', h );
			
							} )
							.transition()
							.delay( 200 );
 			
						}
					}
				}
				function funcmouseout(d)
				{
					div.transition()
                        .duration(2)
                        .style("opacity", 0);
				}
				for( var l=0;l < edge.length ;l++)
					{
					var canvas = group.append("g");
					canvas.append("canvas:defs").append("canvas:marker")
						.attr("id", "triangle")
						.attr("refX", 3)
						.attr("refY", 3)
						.attr("markerWidth", 15)
						.attr("markerHeight", 15)
						.attr("orient", "auto")
						.append("path")
						.attr("d", "M 0 0 3 1.5 0 3 0.75 1.5")
						.style("fill","black");	
					var link = canvas.append("path")
								.attr("label",edge[l].label)
								.attr("src",edge[l].sourceid)
								.attr("dest",edge[l].destinationid)
								.attr("ed_id",edge[l].Id)
								//.attr("flag",edge_map[e].flag)
								.attr("class","link")
								.attr("d",function(){
										
										var id =edge[l].Id;
										var sourcex= getsourcex(edge[l]).srcx;
										var sourcey = getsourcey(edge[l]).srcy;
										var destx = getdestx(edge[l]).desx;
										var desty = getdesty(edge[l]).desy;
										var val = "M "+ sourcex +" "+sourcey+" "+(max_x-20)+" "+sourcey+" "+(max_x-20)+" "+desty+" "+destx+" "+desty;
										return val;})
								.attr("marker-end", "url(#triangle)")
								.attr("stroke",function(){ var col = getedgecolor(edge[l]);
															return col;})
								//.attr("stroke-dasharray",dash)							
														
								.style("fill","none")							
								.on("mouseover",funcmouseover)
								.on("mouseout",funcmouseout);					
				}
			function dash()
			{
				if(d3.select(this).attr("flag")!=0){
					return "3,3";
				}
				else 
					return "0,0";
			}
			function getedgecolor(edg)
			{	
				if((edg.sourceid).includes("T")){
					if((edg.destinationid).includes("T")){
						return "#0098ce";
					}
					else{
						return "#3ad531"
					}
				}
				else if((edg.sourceid).includes("E")){
					if((edg.destinationid).includes("T")){
						return "#ff376";
					}
					else{
						return "#38a6ad4"
					}
				}
			}
			
			function funcmouseover()
            {		
					div.transition()
						.duration(200)
						.style("opacity", .9);
					var label = d3.select(this).attr("label");
					var src = d3.select(this).attr("src");
					var dest = d3.select(this).attr("dest");
					var ed_id = d3.select(this).attr("ed_id");
					div.html("Id: "+ed_id+"<br>Label: "+ label +"<br> Relationship: <br>" + getword(src,dest,label))
							.style("left",d3.event.pageX +"px")
								.style("top", d3.event.pageY - 28 +"px")
								.style("color", "white");
			}
			
			function getword(src,dest,label)
			{
				var relation=" ";
				var stack = [];
				stack.push(dest);
				stack.push(label);
				stack.push(src);
							
				do{
					var pattern = /E[0-9]+/g;
					var pattern2 = /T[0-9]+/g;
					node = stack.pop();
					if(node.includes("T") && pattern2.test(node)){
						relation = relation +lookup(node);
					}
					else if(node.includes("E") && pattern.test(node)){
						relation = relation + "(";
						stack.push(")");
						var temp_edge = lookupedge(node);
						stack.push(temp_edge.destinationid);
						stack.push(temp_edge.label);
						stack.push(temp_edge.sourceid);
										
					}
					else if(node==")"){
							relation = relation+ node;
										
					}
					else{
						relation = relation+ "->"+node+"->";
					}
				
				}while(stack.length !=0);
				return relation;	
			}
			
			function lookup(id){
				return temp_holder[id].word;	
				}
			
			function lookupedge(id){			//change this to look up in all the edges not just the current sentence
			for(var i=0;i<edge.length;i++)
			{
				if(edge[i].Id == id)
					return edge[i];
			}	
			}
			
			function funcmouseout(d)
            {
                div.transition()
                        .duration(2)
                        .style("opacity", 0);
            }
			
			function getsourcex(edg){
				
				if((edg.sourceid).includes("T")){
							
							edg.srcx = temp_holder[edg.sourceid].x;
							return edg;
				}
				else{ 		
							var temp_edg = lookupedge(edg.sourceid);
							
							return getsourcex(temp_edg);
					}
			}
			
			function getsourcey(edg){
			
				if((edg.sourceid).includes("T")){
							edg.srcy = temp_holder[edg.sourceid].y;
							return edg;
				}
				else{ 		
							var temp_edg = lookupedge(edg.sourceid);
							return getsourcey(temp_edg);
						
				}
			}
			
			function getdesty(edg){
			
				if((edg.destinationid).includes("T")){
							edg.desy = temp_holder[edg.destinationid].y;
							return edg;
				}
				else{  		
							var temp_edg = lookupedge(edg.destinationid);
							return getdesty(temp_edg);
						
				}
			}
			
			function getdestx(edg){
			
				if((edg.destinationid).includes("T")){
							edg.desx = temp_holder[edg.destinationid].x;
							return edg;
				}
				else{  
							
							var temp_edg = lookupedge(edg.destinationid);
							return getdestx(temp_edg);
					}
			}
			/*zoom */
			
		/*	let width = $(".stairViz").width();
			let height = $(".stairViz").height();

			svg.select(".group").select(".word").append("rect")
				.attr("width", width)
				.attr("height", height)
				.style("fill", "none")
				.style("pointer-events", "all")
				.call(d3.zoom()
						.scaleExtent([2, 4])
						.on("zoom", zoomed));

		
   function zoomed() {   
		var transform = d3.event.transform;
		var element = d3.select(this);
		svg.select(".group").select(".word").attr("transform", function() {
							return "scale(" + 30 + "," + 30 + ")";
				})
	}*/
 
  

		}			
	
	})
	}
 })	
 
 /*let width = $(".stairViz").width();
 let height = $(".stairViz").height();

 svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed));

		
   function zoomed() {
   console.log("I am called");
  var transform = d3.event.transform;
  svg.attr("transform", function() {
    return "translate(" + transform.applyX(0) + "," + transform.applyY(0) + ")";
  })
}*/


});