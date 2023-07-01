import uuid from './uuidgen'
const LocationTypeExpect = ['IRL', "ONLINE", "PHONE", "OTHER"]
const AttachmentTypeExpect = ['FILE', 'URL']

class Location {
    constructor(input) {
        this.$type = (LocationTypeExpect.includes(input.$type)) ? input.$type : "OTHER";
        this.type = input.type || null;
        this.name = input.name;
        if (input.$type === 'IRL') {
            this.address = input.address;
        } else if (input.$type === 'PHONE') {
            this.number = input.number;
        } else if (input.$type === 'ONLINE') {
            this.URL = input.URL;
        }
        this.note = input.note || null;
    }

    toJSON() {
        return {...this}
    }
}

class Person {
    constructor(input) {
        this.name = input.name;
        this.outsider = input.outsider || true;
        if (this.outsider) {
            this.email = input.email;
        } else {
            this.ID = input.ID;
            this.privileges = input.privileges || null;
        }
        this.status = input.status || null;
    }

    toJSON() {
        return {...this}
    }
}

class Attachment {
    constructor(input) {
        if (AttachmentTypeExpect.includes(input.type)) {
            this.type = input.type;
            if (this.type === "URL") {
                this.href = input.href;
            } else if (this.type === "FILE") {
                this.ID = input.ID;
            }
        }
        this.name = name;
    }
}

class Todo {
    constructor(todo_id, task, completed) {
        this.todo_id = uuid();
        this.task = task;
        this.completed = completed;
    }

    toJSON() {
        return {...this}
    }
}

class Integration {
    constructor(ownedBy, id) {
        this.id = id;
        this.ownedBy = ownedBy;
    }

    toJSON() {
        return {...this}
    }
}

class Event {
    constructor(
        input
    ) {
        this.event_id = uuid();
        this.title = input.title;
        this.description = input.description;
        this.start = new Date(input.start);
        this.end = new Date(input.end);
        this.locations = input.locations || [];
        this.invitees = input.invitees || [];
        this.organizer = new Person(input.organizer);
        this.owner = input.owner || "00000000-0000-0000-0000-000000000000";
        this.tags = input.tags || [];
        this.attachments = input.attachments || [];
        this.note = input.note || null;
        this.todos = input.todos || [];
        this.integrations = input.integrations || [];
        this.flags = input.flags || [];
        // =================================================================
        this.integrations = this.integrations.map( e => new Integration(e) )
        this.todos        = this.todos.map(        e => new Todo(e)        )
        this.attachments  = this.attachments.map(  e => new Attachment(e)  )
        this.invitees     = this.invitees.map(     e => new Person(e)      )
        this.locations    = this.locations.map(    e => new Location(e)    )

    }

    toJSON() {
        return {...this}
    }
}

class Calendar {
    constructor(input) {
        let example = {
            calendar_id: String,
            name: String, 
            owner: String,
            description: String,
            emojiMark: String,
            events: Array
        }

        this.calendar_id = input.calendar_id || uuid();
        this.name = input.name || "Calendar";
        this.owner = input.owner || "00000000-0000-0000-0000-000000000000";
        this.description = input.description;
        this.emojiMark = input.emojiMark || null;

        this.event = input.events.map(e=> new Event(e) )
        
    }
}

export default {Event, Calendar}