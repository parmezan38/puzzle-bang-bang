var Match3 = Match3 || {};

Match3.GameState.bulletDamage = function(enemy, damage, variation, multiplier){
  // Enemy Damage
  if(!enemy.isDead){
    // Obični
    if(variation === 2 && !enemy.isCovered){
      enemy.damageEnemy(damage, true, variation);
    }
    // Penetrating
    else if(variation === 3){
      enemy.damageEnemy(damage, true, variation); 
    }
    // Poison
    else if(variation === 4 && !enemy.isCovered){
      enemy.isPoisoned = true;
      enemy.poisonDamage = damage;
      enemy.poisonTimes = 2 + multiplier;
      enemy.createPoisonTimer(2 + multiplier);
      enemy.damageEnemy(damage, true, variation);
    }
    // Electricity
    else if(variation === 5 && (!enemy.isCovered || enemy.name === 'turtle') ){
      let enemiesToShoot = this.getNearbyEnemies(enemy, multiplier);
      enemiesToShoot.forEach(function(enemyToShoot){
        if (enemyToShoot != enemy){
          enemyToShoot.electricDamage();
          enemyToShoot.damageEnemy(damage, false, variation);
        } else {
          enemy.damageEnemy(damage, true, variation);
        }
      },this);
    }
    // Magic
    else if(variation === 6){
      let thisthis = this;
      this.enemies.forEachAlive(function(enemyToShoot){
        enemyToShoot.damageEnemy(damage, false, variation);
        thisthis.healPlayer(damage);
      });
      //console.log(this.health);
    }
    else {
      enemy.particleFx('pxl3x_grey', 0.7);
    }
  }
  // Cover Damage
  if(enemy.currentCover){
    if(!enemy.currentCover.isDead){
      enemy.currentCover.damageCover(Math.round(damage/4) );
    }
  }
};
Match3.GameState.getNearbyEnemies = function(enemy, multiplier){
  let i, j,
      enemiesToShoot = [];
  // Find Enemies
  for(i = 0; i < this.worldGrid.length; i++) {
    for(j = 0; j < this.worldGrid[i].length; j++) {
      if(this.worldGrid[i][j].enemy != 0){
        this.enemies.forEachAlive(function(newEnemy){
          if (newEnemy.x === this.worldGrid[i][j].x && newEnemy.y === this.worldGrid[i][j].y){
            if(!newEnemy.isDead){
              if (multiplier === 1 && newEnemy.y === enemy.y){
                enemiesToShoot.push(newEnemy);
              }
              else if (multiplier === 2 && (newEnemy.y === enemy.y || newEnemy.y === enemy.y - this.ENEMY_BLOCK_SIZE.h ) ){
                enemiesToShoot.push(newEnemy);
              }
              else if (multiplier > 2){
                enemiesToShoot.push(newEnemy);
              }
            }
          }   
        }, this); // forEachAlive end
      } 
    } // for
  } // for
  return enemiesToShoot;
};



