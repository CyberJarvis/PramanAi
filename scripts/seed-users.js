
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

const seedUsers = async () => {
    await connectDB();

    const users = [
        { email: "admin@example.com", password: "password123", role: "admin" },
        { email: "user@example.com", password: "password123", role: "user" },
    ];

    for (const user of users) {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            console.log(`User ${user.email} already exists`);

            // Should we update the role if it's wrong? Let's just update to be sure.
            if (existingUser.role !== user.role) {
                existingUser.role = user.role;
                await existingUser.save();
                console.log(`Updated role for ${user.email} to ${user.role}`);
            }
            continue;
        }

        const hashedPassword = await bcrypt.hash(user.password, 12);
        await User.create({
            email: user.email,
            password: hashedPassword,
            role: user.role,
        });
        console.log(`Created user ${user.email} with role ${user.role}`);
    }

    process.exit();
};

seedUsers();
