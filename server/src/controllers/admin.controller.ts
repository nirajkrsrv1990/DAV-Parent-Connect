import { Request, Response } from "express";
import pool from "../config/db";

export const adminLogin = async (
  req: Request,
  res: Response
) => {

  try {

    const { email, password } = req.body;

    const result = await pool.query(

      `
      SELECT *
      FROM admin_users
      WHERE email = $1
      AND password = $2
      AND status='Active'
      `,

      [email, password]

    );

    if (result.rows.length === 0) {

      return res.status(401).json({

        success: false,

        message: "Invalid Email or Password"

      });

    }

    res.json({

      success: true,

      admin: result.rows[0]

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: "Server Error"

    });

  }

};