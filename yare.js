console.log("harvesters: " + memory.harvesters.length)
console.log("defenders: " + memory.defenders.length)
console.log("attackers: " + memory.attackers.length)
if(tick == 0){
	d1 = distance(star_zxq.position,base.position)
	d2 = distance(star_a1c.position,base.position)
	
	memory = {harvesters:[],defenders:[],attackers:[], star: (d1>d2 ? star_a1c : star_zxq)}
}
for(i = 0; i < my_spirits.length; i++){
    s = my_spirits[i]
	if(s.mark == ""){
		assign_role(s)
	}
    role = s.mark.split("-")[0]
    if(s.sight.enemies.length > 0){
        s.move(spirits[s.sight.enemies[0]].position)
		s.energize(s.sight.enemies[0])
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
	if(memory.attackers.length < 20){
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
		s.energize(enemy_base)
	}
}
	

function defend(s,role){
    if(s.energy == 0){
		
	}
	s.move(base.position)
}

function harvest(s,role){
	if (base.sight.enemies.length > 0 && s.energy >= 20){
	    var invader = spirits[base.sight.enemies[0]]
		s.move(invader.position)
		s.energize(invader)
	}else{
		if(s.energy == 0){
			s.set_mark(role + "-harvesting")
		}else if(s.energy == s.energy_capacity){
			s.set_mark(role + "-dumping")
		}
		current_goal = s.mark.split("-")[1]
		
		if(current_goal == "harvesting"){
			s.move(memory.star.position)
			s.energize(s)
		}else{
			s.move(base.position)
			s.energize(base)
		}
	}
}

function set_role(s,role){
	old_role = s.mark.split("-")[0] == "harvester"
	if(){
		memory.harvesters.splice(memory.harvesters.indexOf(s.id),1)
	}
	s.set_mark(role)
	
}

function assign_role(s){
	if(memory.harvesters.length < 100 && (memory.defenders.length > 5 || tick < 1)){
		s.set_mark("harvester")
		memory.harvesters.push(s.id)
	}else if(memory.defenders.length < 5){
		s.set_mark("defender")
		memory.defenders.push(s.id)
	}else{
		s.set_mark("attacker")
		memory.attackers.push(s.id)
	}
}

function distance(l1,l2){
    return Math.sqrt( Math.pow((l1[0] - l2[0]),2) + Math.pow(((l1[1] - l2[1])),2)  )
}