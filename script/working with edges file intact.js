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
					//sentence[j]=paragraph[i][j];
					for(k=0;k < len;k++){
						var id=paragraph[i][j][k].Id
						temp_holder[id] = paragraph[i][j][k];
						temp_holder[id].sentenceid=j;
						temp_holder[id].paragraphid=i;
					}
				}
			}	
			var group = svg.append("g").attr("class","group");
			for(i =0;i<datao.length;i++){		//remove when get id from html div
				var rect_w = max_x/(datao.length);
				var rect_h = max_y/(datao.length);
				
				var para_rect = group
							.append("rect")
							.attr("class","para")
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
							render_sentence(index);
				});
			}

			function render_sentence(index){
				
				d3.select("svg").selectAll(".group").selectAll(".para").transition().duration(750)
									.on("start", routine).remove();
								function routine(){	
									 para_rect.transition().duration(750)
										.attr("x", function() { return paragraph[0].x })
										.attr("y", function() { return paragraph[0].y; })
										.attr("width", function() { return max_x;})
										.attr("height", function() { return max_y; }).remove();
								}	
					
				var sentence_gr = group.append("g").attr("class","group");	
				var senrect_w=0;
				var senrect_h=0;
				for(j=0;j<paragraph[index].length;j++){	
					senrect_w = max_x/(paragraph[index].length);
					senrect_h = max_y/(paragraph[index].length);   
					var sent_rect = sentence_gr
							.append("rect")
							.attr("class","sentence")
							.attr("index1",index)
							.attr("index2",j)
							.attr("x", function(){  paragraph[index][j].x = (senrect_w*j);
													return paragraph[index][j].x;})
							.attr("y",function(){ paragraph[index][j].y = (senrect_h*j);
												return paragraph[index][j].y;})
							.attr("width", senrect_w)
							.attr("height", senrect_h)
							.style("fill","green")
							.attr("stroke-width","1")
							.on("click",function(){
									var index1 = d3.select(this).attr("index1");
									var index2 = d3.select(this).attr("index2");
									render_word(sent_rect,index1,index2);
								});	
					}
				}		
				
				function render_word(sent_rect,index1,index2){
					d3.select("svg").selectAll(".group").selectAll(".sentence").transition().duration(750)
									.on("start", routine).remove();
								function routine(){	
									////////////////////////left here leaving the animation as it is check later
									 sent_rect.attr("transform","translate("+paragraph[0][0].x+","+paragraph[0][0].y+")").transition().duration(750)
										.attr("x", function() { return paragraph[0][0].x; })
										.attr("y", function() { return paragraph[0][0].y; })
										.attr("width", function() { return max_x;})
										.attr("height", function() { return max_y; }).remove();
								}
					var min_text;
					var max_text;			
					var word_gr = group.append("g").attr("class","group");	
							var wrdrect_w=0;
							var wrdrect_h=0;
							for(k=0;k<paragraph[index1][index2].length;k++){	
									min_text = paragraph[index1][index2][0];
									max_text = paragraph[index1][index2][paragraph[index1][index2].length-1];	
									wrdrect_w = max_x/(paragraph[index1][index2].length);
									wrdrect_h = max_y/(paragraph[index1][index2].length);   
									var id=paragraph[index1][index2][k].Id;
									var wrd_rect = word_gr	
												.append("rect")
												.attr("class","words")
												.attr("word",temp_holder[id].word)
												.attr("x", function(){  temp_holder[id].x = (wrdrect_w*k);
																	return temp_holder[id].x;})
												.attr("y",function(){ temp_holder[id].y = (wrdrect_h*k);
																	return temp_holder[id].y;})
												.attr("width", wrdrect_w)
												.attr("height", wrdrect_h)
												.style("fill","blue")
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
				wrd_rect.on('mouseenter', function() {
								var word = d3.select(this).attr("word");
								d3.select( this )
									.transition()
									.attr( 'width',100 ).attr( 'height', 100 )
									.attr("fill","blue");
							})
							.on( 'mouseleave', function() {
								var w=d3.select(this).attr("w");
								var h=d3.select(this).attr("h");
								d3.select( this )
									.transition()
									.attr('width',wrdrect_w).attr( 'height', wrdrect_h );
						} )
							.transition()
							.delay( 200 );
					}
					drawedge(min_text,max_text);	
				}
							
				function funcmouseout(d)
				{
					div.transition()
                        .duration(2)
                        .style("opacity", 0);
				}
				function drawedge(min_text,max_text){
					var edge_map={};
					var stack_des=[];
					for( var l=0;l < edge.length ;l++)
					{
						var id = edge[l].Id;
						if(edge[l].sourceid.includes("T") && edge[l].destinationid.includes("T")){
								var src = edge[l].sourceid.split(/(\d+)/);
								var des = edge[l].destinationid.split(/(\d+)/);
								if(parseInt(src[1]) >= parseInt(min_text.wordindex) && parseInt(src[1]) <= parseInt(max_text.wordindex)){
										if(parseInt(des[1]) >= parseInt(min_text.wordindex) && parseInt(des[1]) <= parseInt(max_text.wordindex)){
													edge_map[id] = edge[l];
													edge_map[id].flag =0;
													edge_map[id].sourcex = getsourcex(edge[l]).srcx;
													edge_map[id].sourcey = getsourcey(edge[l]).srcy;
													edge_map[id].destx = getdestx(edge[l]).desx;
													edge_map[id].desty = getdesty(edge[l]).desy;
											}
										else{
													edge_map[id] = edge[l];
													edge_map[id].flag =1;				//destination absent
													edge_map[id].sourcex = getsourcex(edge[l]).srcx;
													edge_map[id].sourcey = getsourcey(edge[l]).srcy;						
											}	
									}
								else{
									if(parseInt(des[1]) >= parseInt(min_text.wordindex) && parseInt(des[1]) <= parseInt(max_text.wordindex)){
														edge_map[id] = edge[l];
														edge_map[id].flag =2;				//source absent
														edge_map[id].destx = getdestx(edge[l]).desx;
														edge_map[id].desty = getdesty(edge[l]).desy;
									}
								}
						}
						else if(edge[l].sourceid.includes("T") && edge[l].destinationid.includes("E")){
							var src = edge[l].sourceid.split(/(\d+)/);
							if(parseInt(src[1]) >= parseInt(min_text.wordindex) && parseInt(src[1]) <= parseInt(max_text.wordindex)){		//in range check destination edge
								if(edge[l].destinationid in edge_map)	{				//both present in range
									edge_map[id] = edge[l];
									edge_map[id].flag =0;
									edge_map[id].sourcex = getsourcex(edge[l]).srcx;
									edge_map[id].sourcey = getsourcey(edge[l]).srcy;
									edge_map[id].destx = getdestx(edge[l]).desx;
									edge_map[id].desty = getdesty(edge[l]).desy;
								}
								else{		//destination edge not there
									//add to a stack
									stack_des.push({parent:edge[l],edge:edge[l].destinationid,flag:1});
								}
							}
						else{//source not in range check destination edge
							if(edge[l].destinationid in edge_map)	{
								edge_map[id] = edge[l];		//destination present in range
								edge_map[id].flag =2;
								edge_map[id].destx = getdestx(edge[l]).desx;
								edge_map[id].desty = getdesty(edge[l]).desy;
							}
							else{		//destination edge not there
								//add to a stack
								stack_des.push({parent:edge[l],edge:edge[l].destinationid,flag:2});
							}		
						}
					}	
					else if(edge[l].sourceid.includes("E") && edge[l].destinationid.includes("T")){
						var des = edge[l].destinationid.split(/(\d+)/);
						if(parseInt(des[1]) >= parseInt(min_text.wordindex) && parseInt(des[1]) <= parseInt(max_text.wordindex)){		//in range check destination edge
							if(edge[l].sourceid in edge_map)	{				//both present in range
								edge_map[id] = edge[l];
								edge_map[id].flag =0;
								edge_map[id].sourcex = getsourcex(edge[l]).srcx;
								edge_map[id].sourcey = getsourcey(edge[l]).srcy;
								edge_map[id].destx = getdestx(edge[l]).desx;
								edge_map[id].desty = getdesty(edge[l]).desy;
							}
							else{		//destination edge not there
								//add to a stack
								stack_des.push({parent:edge[l],edge:edge[l].sourceid,flag:1});
							}
						}
						else{//source not in range check source edge
							if(edge[l].sourceid in edge_map)	{				//both present in range
								edge_map[id] = edge[l];
								edge_map[id].flag =1;
								edge_map[id].sourcex = getsourcex(edge[l]).srcx;
								edge_map[id].sourcey = getsourcey(edge[l]).srcy;													
						}
						else{		//destination edge not there
							//add to a stack
							stack_des.push({parent:edge[l],edge:edge[l].sourceid,flag:1});					
						}		
					}
				}
				else if(edge[l].sourceid.includes("E") && edge[l].destinationid.includes("E")){
					if(edge[l].sourceid in edge_map){
						if(edge[l].destinationid in edge_map)	{				//both present in range
							edge_map[id] = edge[l];
							edge_map[id].flag =0;
							edge_map[id].sourcex = getsourcex(edge[l]).srcx;
							edge_map[id].sourcey = getsourcey(edge[l]).srcy;
							edge_map[id].destx = getdestx(edge[l]).desx;
							edge_map[id].desty = getdesty(edge[l]).desy;
						}
						else{ //if destination is not there
							//add to a stack
							stack_des.push({parent:edge[l],edge:edge[l].destinationid,flag:2});
						}
					}
					else{
						if(edge[l].destinationid in edge_map)	{				//destination present in range
							edge_map[id] = edge[l];
							edge_map[id].flag =2;
							edge_map[id].destx = getdestx(edge[l]).desx;
							edge_map[id].desty = getdesty(edge[l]).desy; // this block doubtful
						}
						else{
							stack_des.push({parent:edge[l],edge:edge[l].destinationid,flag:2});
							stack_des.push({parent:edge[l],edge:edge[l].sourceid,flag:1});
						}
					}	
				}
							
			}
			stack_des.sort(function(a, b) {	
				var edge1=a.edge.split(/(\d+)/);
				var edge2=b.edge.split(/(\d+)/);				
				return (edge1[1]) - (edge2[1]);
			});
			while(stack_des.length!=0)
				{
					var popped = stack_des.pop();
					
					//if(popped.edge in edge_map){
						var parent = popped.parent;
						if(popped.flag ==1){		//destination missing source present
							if(popped.parent.destinationid in edge_map){
								var temp_id = popped.parent.Id;
								edge_map[temp_id] = popped.parent;
								edge_map[temp_id].flag =0;
								edge_map[temp_id].sourcex = getsourcex(popped.parent).srcx;
								edge_map[temp_id].sourcey = getsourcey(popped.parent).srcy;
								edge_map[temp_id].destx = getdestx(popped.parent).desx;
								edge_map[temp_id].desty = getdesty(popped.parent).desy;
							}
							else{			//not in edge map may be in stack
								if(popped.parent.destinationid in stack_des){
									var index = stack_des.indexOf(popped.parent.destinationid);
									stack_des.splice(index,1);
									var temp_id = popped.parent.Id;
									edge_map[temp_id] = popped.parent;
									edge_map[temp_id].flag =0;
									edge_map[temp_id].sourcex = getsourcex(popped.parent).srcx;
									edge_map[temp_id].sourcey = getsourcey(popped.parent).srcy;
									edge_map[temp_id].destx = getdestx(popped.parent).desx;
									edge_map[temp_id].desty = getdesty(popped.parent).desy;
								}
								else{
									var temp_id = popped.parent.Id;
									edge_map[temp_id] = popped.parent;
									edge_map[temp_id].flag =1;
									edge_map[temp_id].sourcex = getsourcex(popped.parent).srcx;
									edge_map[temp_id].sourcey = getsourcey(popped.parent).srcy;
								}
							}
						}
					
					else{
							if(popped.parent.sourceid in edge_map){
								var temp_id = popped.parent.Id;
								edge_map[temp_id] = popped.parent;
								edge_map[temp_id].flag =0;
								edge_map[temp_id].sourcex = getsourcex(popped.parent).srcx;
								edge_map[temp_id].sourcey = getsourcey(popped.parent).srcy;
								edge_map[temp_id].destx = getdestx(popped.parent).desx;
								edge_map[temp_id].desty = getdesty(popped.parent).desy;
							}
							else{			//not in edge map may be in stack
								if(popped.parent.sourceid in stack_des){
									var index = stack_des.indexOf(popped.parent.destinationid);
									stack_des.splice(index,1);
									var temp_id = popped.parent.Id;
									edge_map[temp_id] = popped.parent;
									edge_map[temp_id].flag =0;
									edge_map[temp_id].sourcex = getsourcex(popped.parent).srcx;
									edge_map[temp_id].sourcey = getsourcey(popped.parent).srcy;
									edge_map[temp_id].destx = getdestx(popped.parent).desx;
									edge_map[temp_id].desty = getdesty(popped.parent).desy;
								}
								else{
									var temp_id = popped.parent.Id;
									edge_map[temp_id] = popped.parent;
									edge_map[temp_id].flag =2;
									edge_map[temp_id].destx = getdestx(popped.parent).desx;
									edge_map[temp_id].desty = getdesty(popped.parent).desy;
								}
							}
							
						}
					
				
				}
				
			function size(obj) {
					var size = 0, key;
					for (key in obj) {
						if (obj.hasOwnProperty(key)) size++;
					}
					return size;
			};
			
				//for( var l=0;l < edge.length ;l++)
				for( e in edge_map)
					{
					var canvas = svg.append("g");
					canvas.append("canvas:defs").append("canvas:marker")
						.attr("id", "triangle")
						.attr("refX", 3)
						.attr("refY", 3)
						.attr("markerWidth", 15)
						.attr("markerHeight", 15)
						.attr("orient", "auto")
						.append("path")
						.attr("d", "M 0 0 6 3 0 6 1.5 3")
						.style("fill","black");	
					var link = canvas.append("path")
								.attr("label",edge_map[e].label)
								.attr("src",edge_map[e].sourceid)
								.attr("dest",edge_map[e].destinationid)
								.attr("ed_id",edge_map[e].Id)
								.attr("flag",edge_map[e].flag)
								.attr("class","link")
								.attr("d",function(){
										
										var id =edge_map[e].Id;
										
										var val;
										if(edge_map[e].flag==0){
											
											val = "M "+ edge_map[e].sourcex +" "+edge_map[e].sourcey+" "+(max_x-20)+" "+edge_map[e].sourcey+" "+(max_x-20)+" "+edge_map[e].desty+" "+edge_map[e].destx+" "+edge_map[e].desty;
										}
										else if(edge_map[e].flag==1){
											val = "M "+ edge_map[e].sourcex +" "+edge_map[e].sourcey+" "+(max_x-20)+" "+edge_map[e].sourcey;
										}
										else if(edge_map[e].flag==2){
											val = "M "+(max_x-20)+" "+edge_map[e].desty+" "+edge_map[e].destx+" "+edge_map[e].desty;
										}
										return val;})
								.attr("marker-end", "url(#triangle)")
								.attr("stroke",function(){ var col = getedgecolor(edge_map[e]);
															return col;})
								.attr("stroke-dasharray",dash)							
														
								.style("fill","none")							
								.on("mouseover",funcmouseover)
								.on("mouseout",funcmouseout);					
				}
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