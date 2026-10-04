const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

function sanitizeUser(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET belum diatur di file .env");
  }

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d", // token berlaku 7 hari
    },
  );
}

async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    // Validasi field wajib
    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi.",
      });
    }

    // Validasi format email sederhana
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Format email tidak valid.",
      });
    }

    //  Validasi panjang password
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name:
          typeof name === "string" && name.trim() !== "" ? name.trim() : null,
      },
    });

    return res.status(201).json({
      message: "Register berhasil.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Email sudah terdaftar.",
      });
    }

    console.error("Error register:", error);

    return res.status(500).json({
      message: "Terjadi kesalahan server.",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Email atau password salah.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email atau password salah.",
      });
    }
    const token = generateToken(user);

    return res.status(200).json({
      message: "Login berhasil.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Error login:", error);

    return res.status(500).json({
      message: "Terjadi kesalahan server.",
    });
  }
}

module.exports = {
  register,
  login,
};
