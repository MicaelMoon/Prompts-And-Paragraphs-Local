export class Entity {
    name!:string;
    maxHealth!:number;
    currentHealth!:number;
    maxAttack!:number;
    currentAttack!:number;
    maxDefense!:number;
    currentDefense!:number;

    constructor(name: string,
        maxHealth: number,
        maxAttack: number,
        maxDefense: number,){
            this.name = name;
            this.maxHealth = maxHealth;
            this.maxAttack = maxAttack;
            this.maxDefense = maxDefense;
            this.currentHealth = maxHealth; 
            this.currentAttack = maxAttack;
            this.currentDefense = maxDefense;
    }

    takeDamage(damage: number){
        let damageTaken = (damage - this.currentDefense);
        if (damageTaken < 0) damageTaken = 0;

        this.currentHealth -= damageTaken;
        
        if (this.currentHealth < 0) this.currentHealth = 0;

        console.log(`${this.name} took ${damageTaken} damage and is left at ${this.currentHealth}`)
    }

    attack(target: Entity){
        target.takeDamage(this.currentAttack)
    }
}