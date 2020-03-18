const sql = require('mssql');

var webconfig = {
  user: 'batuhan61',
  password: 'batuhan28',
  server: '192.168.2.165',
  database: 'bitirmeProjesi'
};

// Üye İşlemleri
module.exports.userUyeOl = function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select  dbo.fn_UyeKontrol ('" + req.body.uye_kullanici_Adi + "','" + req.body.uye_EMail + "') as varmi", function(err, control) {
      if (err) {
        console.log(err);
      }
      control.recordset.forEach(function(kullanici) {
        if (kullanici.varmi == 'Evet') {
          res.render('oturumac', { hata: 'Kullanıcı adı bulunmaktadır ' });
          sql.close();
        } else {
          request1.query(
            "INSERT INTO Uye(Adi,Soyadi,Sifre,Email,KullaniciAdi)  VALUES('" +
              req.body.uye_Adi +
              "','" +
              req.body.uye_Soyadi +
              "','" +
              req.body.uye_Sifre +
              "','" +
              req.body.uye_EMail +
              "','" +
              req.body.uye_kullanici_Adi +
              "')",
            function(err, data) {
              if (err) {
                console.log(err);
              }
              res.render('oturumac', { hata: '' });
              sql.close();
            }
          );
        }
      });
    });
  });
};

module.exports.UyeOl = function(req, res) {
  res.render('oturumac', { hata: '' });
};

// Kullanıcı Giriş Kontrol
module.exports.kullaniciGiris = function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select dbo.fn_UyeVarmi('" + req.body.ad + "','" + req.body.sifre + "') as Sonuc", function(err, verisonucu) {
      if (err) {
        console.log(err);
      }
      verisonucu.recordset.forEach(function(kullanici) {
        if (kullanici.Sonuc == 'Evet') {
          request1.query("select * from Uye where KullaniciAdi='" + req.body.ad + "'", function(err, data) {
            req.session.ad = req.body.ad;
            if (err) {
              console.log(err);
            }
            sql.close();
            res.render('Anasayfa', { veri: data.recordset });
          });
        } else {
          res.render('Login', { hata: 'Kullanıcı adı veya sifre hatalı' });
          sql.close();
        }
      });
    });
  });
};

// Mekan Üyeliği
module.exports.userMekanUye = function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select  dbo.fn_MekanKontrol ('" + req.body.mekan_Adi + "') as varmi", function(err, control) {
      if (err) {
        console.log(err);
      }
      control.recordset.forEach(function(kullanici) {
        if (kullanici.varmi == 'Evet') {
          res.render('oturumac', { hata: 'Bu mekan sisteme kayıtlıdır. ' });
          sql.close();
        } else {
          request1.query(
            "INSERT INTO Mekan(MekanAdı,AdıSoyadı,Sifre,Lokasyon,MekanResim,AcilisSaati,KapanisSaati,PaketSiparis,Kategori)  VALUES('" +
              req.body.mekan_Adi +
              "','" +
              req.body.uye_Adi_Soyadi +
              "','" +
              req.body.mekan_Sifre +
              "','" +
              req.body.mekan_lokasyon +
              "',CAST( '" +
              req.file.buffer.toString('base64') +
              "'  AS VARBINARY(MAX)) ,'" +
              req.body.mekan_acilisSaati +
              "','" +
              req.body.mekan_kapanisSaati +
              "','" +
              req.body.paketSiparis +
              "','" +
              req.body.kategori +
              "')",
            function(err, data) {
              if (err) {
                console.log(err);
              }
              res.render('oturumac', { hata: '' });
              sql.close();
            }
          );
        }
      });
    });
  });
};

// Mekan Girişi
module.exports.mekanGiris = function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select dbo.fn_MekanVarmi('" + req.body.ad + "','" + req.body.sifre + "') as Sonuc", function(err, verisonucu) {
      if (err) {
        console.log(err);
      }
      verisonucu.recordset.forEach(function(kullanici) {
        if (kullanici.Sonuc == 'Evet') {
          request1.query("select * from Mekan where MekanAdı='" + req.body.ad + "'", function(err, data) {
            req.session.ad = req.body.ad;
            if (err) {
              console.log(err);
            }
            sql.close();
            res.render('Anasayfa', { veri: data.recordset });
          });
        } else {
          res.render('mekanLogin', { hata: 'Kullanıcı adı veya sifre hatalı' });
          sql.close();
        }
      });
    });
  });
};
module.exports.hamburger = function(req, res) {
  // Hamburger kategorisi
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select * from Mekan where Kategori = 'Hamburger' ", function(err, verisonucu) {
      if (err) {
        console.log(err);
      }
      sql.close();
      res.render('hamburger', { veri: verisonucu.recordset });
    });
  });
};

module.exports.Profile = function(req, res) {
  // Profilim
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();

    request1.query("select * from Uye where KullaniciAdi ='" + req.session.ad + "'", function(err, verisonucu) {
      if (err) {
        console.log(err);
      }

      console.log('', req.session.ad);
      sql.close();
      res.render('Profilim', { veri: verisonucu.recordset });
    });
  });
};

module.exports.KullaniciLogin = function(req, res) {
  res.render('Login', { hata: '' });
};

module.exports.PatronLogin = function(req, res) {
  res.render('PatronUye', { hata: '' });
};

module.exports.PatronGiris = function(req, res) {
  res.render('mekanlogin', { hata: '' });
};
