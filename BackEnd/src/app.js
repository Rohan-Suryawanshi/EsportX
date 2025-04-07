import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true,
}));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan('dev'));

//Routes
import userRoutes from './routes/user.routes.js';
import gameRoutes from './routes/game.routes.js';
import bannerRoutes from "./routes/banner.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import matchRoutes from "./routes/match.routes.js"
import paymentRouter from "./routes/payment.routes.js";
import matchParticipantRouter from './routes/matchparticipant.routes.js';

//http://localhost:8000/api/v1/users/register
app.use('/api/v1/users', userRoutes);
app.use("/api/v1/games", gameRoutes);
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/matches", matchRoutes);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/match-participants", matchParticipantRouter);
//Error Handling middleware
app.use((err, req, res, next) => {
  console.error(" 🥺 Error:", err); // Logs the error for debug

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export {app};