export class Info {
    constructor(message, room, userOn, author){
        this.message = message
        this.room = room
        this.userOn = userOn
        this.author = author
        this.time  = new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
    }
}


