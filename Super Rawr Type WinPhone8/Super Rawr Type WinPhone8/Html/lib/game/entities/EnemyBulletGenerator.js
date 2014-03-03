﻿/*********************************************************************
 * BulletGenerator.js
 * Creates an array (pool) of bullets to be used by the player
 * with the intention of improved performance.
 *
 * The base of this code can be attributed to Liza Shulyayeva's object 
 * pooling tutorial: http://liza.io/a-first-try-at-object-pooling/
 * @copyright (c) 2013 Dave Voyles, under The MIT License (see LICENSE)
 *********************************************************************/

ig.module(
    'game.entities.EnemyBulletGenerator'
)
    .requires(
    'impact.entity'
)
    .defines(function () {

        EntityEnemyBulletGenerator = ig.Entity.extend({
            _wmIgnore: true,
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(128, 28, 230, 0.7)',
            _wmScalable: true,
            size: { x: 8, y: 8 },
            enemyBullet01Arr: [],
            activeEnemyBullet01Arr: [],
            enemyBullet02Arr: [],
            activeEnemyBullet02Arr: [],
            spinningShipBulletArr: [],
            activeSpinningShipBulletArr: [],
            maxInstances: 35,

            /********************************************************
            * useBullet
            * Makes use of the object stored in the pool
            ********************************************************/
            useBullet: function (object, parent, attributes, opt_xOffset, opt_yOffSet) {
                
                // Set poolArr and entityType depending on which entity is being used
                this.entityType = null;
                this.activeArray = null;
                this.poolArr = null;
                var entity = null;
                var parentObject = null;

                switch (object) {
                    case 'EntityEnemyBullet01':
                        this.poolArr = this.enemyBullet01Arr;    
                        this.entityType = 'EntityEnemyBullet01';
                        this.activeArray = this.activeEnemyBullet01Arr;
                        break;
                    case 'EntityEnemyBullet02':
                        this.poolArr = this.enemyBullet02Arr;
                        this.entityType = 'EntityEnemyBullet02';
                        this.activeArray = this.activeEnemyBullet02Arr;
                        break;
                    case 'EntitySpinningShipBullet':
                        this.poolArr = this.spinningShipBulletArr;
                        this.entityType = 'EntitySpinningShipBullet';
                        this.activeArray = this.activeSpinningShipBulletArr;
                        break;
                }                
                       
                if (this.poolArr.length > 0) {
                    // check to see if there is a spare one
                    entity = this.poolArr.pop();
                    console.log('if');
                }
                
                // Spawn new entity
                else {
                    entity = ig.game.spawnEntity(this.entityType, 0, 0);
                    console.log('else is called');
                }

                this.activeArray.push();

                // Get the parent object (the enemy the bullets will spawn from)
                var parentObject = parent;

                // Sets optional X and Y position offset from parent
                // Workaround for firing multiple projectiles for SpinningShip
                var xPos = opt_xOffset;
                var yPos = opt_yOffSet;
                
                // Set bullet position, based on position of parent
                entity.pos.x = parentObject.pos.x + xPos;
                entity.pos.y = parentObject.pos.y + yPos;


                // Initialize entity and set it to inUse
                entity.inUse = true;
                
                //  Set any additional attributes
                for (var propt in attributes) {
                    entity[propt] = attributes[propt];
                }
            },

            /********************************************************
            * removeEntity
            * Deactivates entity by setting inUse bool to false
            ********************************************************/
            removeEntity: function (object) {
                // clear variables
                var entity = null;
                
                switch (object) {
                    case 'EntityEnemyBullet01':
                        this.poolArr = this.enemyBullet01Arr;
                        this.activeArray = this.activeEnemyBullet01Arr;
                        break;
                    case 'EntityEnemyBullet02':
                        this.poolArr = this.enemyBullet02Arr;
                        this.activeArray = this.activeEnemyBullet02Arr;
                        break;
                    case 'EntitySpinningShipBullet':
                        this.poolArr = this.spinningShipBulletArr;
                        this.activeArray = this.activeSpinningShipBulletArr;
                        break;
                }

                // Deactivate bullet
                entity = object;
                entity.inUse = false;


                // find the active bullet and remove it
                // NOTE: Not using indexOf since it wont work in IE8 and below
                for (var i = 0, l = this.activeArray.length; i < l; i++)
                    if (this.activeArray[i] == entity)
                        array.slice(i, l);

                // return the bullet back into the pool
                this.poolArr.push(entity);
              },


            /********************************************************
            * clear
            * Removes all entities, used to restart a level
            ********************************************************/
            clear: function () {
                // For all bullets in the array
                for (var i = 0; i < this.poolArr.length; i++) {
                    // Kill them
                    this.poolArr[i].kill();
                }
                // Set the total number of items in array to 0
                this.poolArr.length = 0;
            },
        });
    });