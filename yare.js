if(tick == 0){
	d1 = distance(star_zxq.position,base.position)
	d2 = distance(star_a1c.position,base.position)
	
	memory = {star: (d1>d2 ? star_a1c : star_zxq), harvest_middle:false}
}
report = role_report()
console.log("harvesters: " + report.harvesters)
console.log("defenders: " + report.defenders)
console.log("attackers: " + report.attackers)
console.log("tick: " + tick)
defenders = get_role("defender")

// Control Panel
ALL_ATTACK = false
ALL_DEFEND = false


if(tick < 20){
    a = 0
}else{
    a = 5
}

if(memory.star.energy < 100){
	memory.harvest_middle = true
}

for(i = a; i < my_spirits.length; i++){
    s = my_spirits[i]
	if(s.mark == ""){
		assign_role(s)
	}
    role = s.mark.split("-")[0]
    if(s.sight.enemies.length > 0){
    	if(s.energy > 0){
	        s.move(spirits[s.sight.enemies[0]].position)
		s.energize(s.sight.enemies[0])
    	}else if(s.sight.enemies_beamable.length > 0){
    		enemy = spirits[s.sight.enemies_beamable[0]].position
    		escape_vector = [s.position[0] - (enemy[0] + 2* memory.star.position[0])/3, s.position[1] - (enemy[1] + 2 * memory.star.position[1])/3]
    		target = [s.position[0] + escape_vector[0],s.position[1] + escape_vector[1]]
    		s.move(target)
    		s.energize(s)
    	}else{
    	switch(role) {
			case "harvester":
				harvest(s,role)
				break;
			case "defender":
				defend(s,role)
				break;
			case "attacker":
				attack(s,role)
				break;
			default:
				harvest(s,role)
		}
    	}
    	
    }else{
       switch(role) {
			case "harvester":
				harvest(s,role)
				break;
			case "defender":
				defend(s,role)
				break;
			case "attacker":
				attack(s,role)
				break;
			default:
				harvest(s,role)
		}
    }
}



function attack(s,role){
    if(s.energy > 0){
    	report = role_report()
    	if((report.attackers < 5 && tick < 500) || (report.attackers < 20 && tick > 500 && tick < 1500) || (report.attackers < 75 && tick > 1500)){
    		if(s.energy < s.energy_capacity){
    			s.move(memory.star.position)
    			s.energize(s)
    		}else{
    			s.move(base.position)
    			if (base.sight.enemies.length > 0){
    			  var invader = spirits[base.sight.enemies[0]]
    			  if (s.energy >= 20) s.set_mark('attacker')
    			  if (s.mark == 'attacker') {
    				s.move(invader.position)
    				s.energize(invader)
    			  }
    			}
    		}
    	}else{
    		s.move(enemy_base.position)
    		if(distance(enemy_base.position, s.position) > 300){
    		    s.energize(s)
    		}else{
    		    s.energize(enemy_base)
    		}
    	}
    }else{
        s.set_mark("harvester-harvesting")
    }
}
	

function defend(s,role){
	if(s.energy == s.energy_capacity){
		s.set_mark("defender-defending")
	}else if(s.energy < 5){
		s.set_mark("defender-charging")
	}
	
	if(s.energy_capacity < 50){
		
		s.move(defenders[0].position)
		s.merge(defenders[0])
		
	}else{
		if(s.mark == "defender-charging"){
			if(distance(s.position,memory.star.position) > 200){
					s.move(memory.star.position)
			}
			s.energize(s)
		}else{
			s.move(base.position)
		}
	}
	
	
	
	
}	
	
for(i=0;i<a;i++){
        s = my_spirits[i]
        
        if(s.sight.enemies.length > 0){
    		enemy = spirits[s.sight.enemies[0]].position
    		escape_vector = [s.position[0] - enemy[0], s.position[1] - enemy[1]]
    		target = [s.position[0] + escape_vector[0],s.position[1] + escape_vector[1]]
    		s.move(target)
    	}else{
		if(s.energy == 0){
			s.set_mark("harvester-harvesting")
		}else if(s.energy == s.energy_capacity){
			s.set_mark("harvester-dumping")
		}
			current_goal = s.mark.split("-")[1]
			target = star_p89.position
			if(current_goal == "harvesting"){
				if(distance(s.position,target) > 200){
					s.move(target)
				}
				s.energize(s)
			}else{
				if(distance(s.position,outpost.position) > 200){
					s.move(outpost.position)
				}
				s.energize(outpost)
		}
	}
}

function harvest(s){
	if (base.sight.enemies.length > 0 && s.energy >= 20){
	    var invader = spirits[base.sight.enemies[0]]
		s.move(invader.position)
		s.energize(invader)
	}else{
		if(s.energy == 0){
			s.set_mark("harvester-harvesting")
		}else if(s.energy == s.energy_capacity){
			s.set_mark("harvester-dumping")
			assign_role(s)
		}
		id = parseInt(s.id.split("_")[1])
		current_goal = s.mark.split("-")[1]
		target = memory.star.position
		if(memory.harvest_middle && id % 2 == 1){
			target = star_p89.position
		}
		if(current_goal == "harvesting"){
			if(distance(s.position,target) > 200){
				s.move(target)
			}
			s.energize(s)
		}else{
			if(distance(s.position,base.position) > 200){
				s.move(base.position)
			}
			s.energize(base)
		}
	}
}

function set_role(s,role){
	s.set_mark(role)
}

function role_report(){
	output = {harvesters:0,defenders:0,attackers:0}
	for(s of my_spirits){
		if(s.hp >0){
			role = s.mark.split("-")[0]
			output[role + "s"] += 1
		}
	}
	return output
}

function get_role(role){
	output = []
	for(s of my_spirits){
		srole = s.mark.split("-")[0]
		if(srole == role){
			output.push(s)
		}
	}
	return output
}

function assign_role(s){
    
    if(ALL_ATTACK){
        s.set_mark("attacker")
    }else{
        report = role_report()
    	if(star_p89.energy > 0 && report.harvesters > 50){
    		s.set_mark("attacker")
    	}else if(report.defenders < 5 && report.harvesters > 10 && tick > 100){
    		s.set_mark("defender")
    	}else{
    		s.set_mark("harvester")
    	}
    }
	
}

function distance(l1,l2){
    return Math.sqrt( Math.pow((l1[0] - l2[0]),2) + Math.pow(((l1[1] - l2[1])),2)  )
}
