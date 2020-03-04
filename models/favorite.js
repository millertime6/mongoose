const favoriteSchema = new Schema({
    admin: {
        type: Boolean,
        default: false,

    }
});

userSchema.plugin(passportLocalMongoose);