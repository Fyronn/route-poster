using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace RoutePoster.Infrastructure;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<TblAracKonumlari> TblAracKonumlaris { get; set; }

    public virtual DbSet<TblAraclar> TblAraclars { get; set; }

    public virtual DbSet<TblDuraklar> TblDuraklars { get; set; }

    public virtual DbSet<TblKullanicilar> TblKullanicilars { get; set; }

    public virtual DbSet<TblKurumDepartmanlar> TblKurumDepartmanlars { get; set; }

    public virtual DbSet<TblMusteriKurumlar> TblMusteriKurumlars { get; set; }

    public virtual DbSet<TblRoller> TblRollers { get; set; }

    public virtual DbSet<TblRotaDuraklari> TblRotaDuraklaris { get; set; }

    public virtual DbSet<TblRotalar> TblRotalars { get; set; }

    public virtual DbSet<TblSeferAtamalari> TblSeferAtamalaris { get; set; }

    public virtual DbSet<TblSeferYoklama> TblSeferYoklamas { get; set; }

    public virtual DbSet<TblSeferler> TblSeferlers { get; set; }

    public virtual DbSet<TblTurizmFirmalari> TblTurizmFirmalaris { get; set; }

    public virtual DbSet<TblYolcuIstisnalari> TblYolcuIstisnalaris { get; set; }

    public virtual DbSet<TblYolcuRotaTercihleri> TblYolcuRotaTercihleris { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TblAracKonumlari>(entity =>
        {
            entity.HasKey(e => e.KonumId).HasName("PK__TBL_ARAC__11C086045E46589F");

            entity.ToTable("TBL_ARAC_KONUMLARI");

            entity.Property(e => e.KonumId).HasColumnName("Konum_ID");
            entity.Property(e => e.AracId).HasColumnName("Arac_ID");
            entity.Property(e => e.Boylam).HasColumnType("decimal(11, 8)");
            entity.Property(e => e.Enlem).HasColumnType("decimal(10, 8)");
            entity.Property(e => e.HizKmH).HasColumnName("Hiz_KmH");
            entity.Property(e => e.KayitZamani)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("Kayit_Zamani");
            entity.Property(e => e.SeferId).HasColumnName("Sefer_ID");

            entity.HasOne(d => d.Arac).WithMany(p => p.TblAracKonumlaris)
                .HasForeignKey(d => d.AracId)
                .HasConstraintName("FK__TBL_ARAC___Arac___02084FDA");

            entity.HasOne(d => d.Sefer).WithMany(p => p.TblAracKonumlaris)
                .HasForeignKey(d => d.SeferId)
                .HasConstraintName("FK__TBL_ARAC___Sefer__01142BA1");
        });

        modelBuilder.Entity<TblAraclar>(entity =>
        {
            entity.HasKey(e => e.AracId).HasName("PK__TBL_ARAC__0B8D7A579CF97AB3");

            entity.ToTable("TBL_ARACLAR");

            entity.HasIndex(e => e.Plaka, "UQ__TBL_ARAC__830E30F7B7781C7C").IsUnique();

            entity.Property(e => e.AracId).HasColumnName("Arac_ID");
            entity.Property(e => e.AktifMi)
                .HasDefaultValue(true)
                .HasColumnName("Aktif_Mi");
            entity.Property(e => e.AracTipi)
                .HasMaxLength(50)
                .HasColumnName("Arac_Tipi");
            entity.Property(e => e.DonanimOzellikleri)
                .HasMaxLength(255)
                .HasColumnName("Donanim_Ozellikleri");
            entity.Property(e => e.MarkaModel)
                .HasMaxLength(100)
                .HasColumnName("Marka_Model");
            entity.Property(e => e.Plaka).HasMaxLength(20);
            entity.Property(e => e.TurizmFirmaId).HasColumnName("Turizm_Firma_ID");
            entity.Property(e => e.UretimYili).HasColumnName("Uretim_Yili");

            entity.HasOne(d => d.TurizmFirma).WithMany(p => p.TblAraclars)
                .HasForeignKey(d => d.TurizmFirmaId)
                .HasConstraintName("FK__TBL_ARACL__Turiz__5070F446");
        });

        modelBuilder.Entity<TblDuraklar>(entity =>
        {
            entity.HasKey(e => e.DurakId).HasName("PK__TBL_DURA__64D53453E17480EA");

            entity.ToTable("TBL_DURAKLAR");

            entity.Property(e => e.DurakId).HasColumnName("Durak_ID");
            entity.Property(e => e.Adres).HasMaxLength(255);
            entity.Property(e => e.AktifMi)
                .HasDefaultValue(true)
                .HasColumnName("Aktif_Mi");
            entity.Property(e => e.BirlestirilenDurakId).HasColumnName("Birlestirilen_Durak_ID");
            entity.Property(e => e.Boylam).HasColumnType("decimal(11, 8)");
            entity.Property(e => e.DurakAdi)
                .HasMaxLength(150)
                .HasColumnName("Durak_Adi");
            entity.Property(e => e.Enlem).HasColumnType("decimal(10, 8)");
            entity.Property(e => e.KurumId).HasColumnName("Kurum_ID");
            entity.Property(e => e.OperatorNotu).HasColumnName("Operator_Notu");
            entity.Property(e => e.Statu)
                .HasMaxLength(30)
                .HasDefaultValue("Talep Edildi");
            entity.Property(e => e.TurizmFirmaId).HasColumnName("Turizm_Firma_ID");

            entity.HasOne(d => d.BirlestirilenDurak).WithMany(p => p.InverseBirlestirilenDurak)
                .HasForeignKey(d => d.BirlestirilenDurakId)
                .HasConstraintName("FK__TBL_DURAK__Birle__571DF1D5");

            entity.HasOne(d => d.Kurum).WithMany(p => p.TblDuraklars)
                .HasForeignKey(d => d.KurumId)
                .HasConstraintName("FK__TBL_DURAK__Kurum__5535A963");

            entity.HasOne(d => d.TurizmFirma).WithMany(p => p.TblDuraklars)
                .HasForeignKey(d => d.TurizmFirmaId)
                .HasConstraintName("FK__TBL_DURAK__Turiz__5441852A");
        });

        modelBuilder.Entity<TblKullanicilar>(entity =>
        {
            entity.HasKey(e => e.KullaniciId).HasName("PK__TBL_KULL__232AD4322216F6C9");

            entity.ToTable("TBL_KULLANICILAR");

            entity.HasIndex(e => e.Email, "UQ__TBL_KULL__A9D10534A4FF3158").IsUnique();

            entity.Property(e => e.KullaniciId).HasColumnName("Kullanici_ID");
            entity.Property(e => e.Ad).HasMaxLength(50);
            entity.Property(e => e.AktifMi)
                .HasDefaultValue(true)
                .HasColumnName("Aktif_Mi");
            entity.Property(e => e.CihazToken)
                .HasMaxLength(255)
                .HasColumnName("Cihaz_Token");
            entity.Property(e => e.DepartmanId).HasColumnName("Departman_ID");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.KimlikNo)
                .HasMaxLength(20)
                .HasColumnName("Kimlik_No");
            entity.Property(e => e.KurumId).HasColumnName("Kurum_ID");
            entity.Property(e => e.OlusturmaTarihi)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("Olusturma_Tarihi");
            entity.Property(e => e.RolId).HasColumnName("Rol_ID");
            entity.Property(e => e.SifreHash)
                .HasMaxLength(255)
                .HasColumnName("Sifre_Hash");
            entity.Property(e => e.Soyad).HasMaxLength(50);
            entity.Property(e => e.Telefon).HasMaxLength(20);
            entity.Property(e => e.TurizmFirmaId).HasColumnName("Turizm_Firma_ID");

            entity.HasOne(d => d.Departman).WithMany(p => p.TblKullanicilars)
                .HasForeignKey(d => d.DepartmanId)
                .HasConstraintName("FK__TBL_KULLA__Depar__49C3F6B7");

            entity.HasOne(d => d.Kurum).WithMany(p => p.TblKullanicilars)
                .HasForeignKey(d => d.KurumId)
                .HasConstraintName("FK__TBL_KULLA__Kurum__48CFD27E");

            entity.HasOne(d => d.Rol).WithMany(p => p.TblKullanicilars)
                .HasForeignKey(d => d.RolId)
                .HasConstraintName("FK__TBL_KULLA__Rol_I__4AB81AF0");

            entity.HasOne(d => d.TurizmFirma).WithMany(p => p.TblKullanicilars)
                .HasForeignKey(d => d.TurizmFirmaId)
                .HasConstraintName("FK__TBL_KULLA__Turiz__47DBAE45");
        });

        modelBuilder.Entity<TblKurumDepartmanlar>(entity =>
        {
            entity.HasKey(e => e.DepartmanId).HasName("PK__TBL_KURU__E914C1AD6AD5436F");

            entity.ToTable("TBL_KURUM_DEPARTMANLAR");

            entity.Property(e => e.DepartmanId).HasColumnName("Departman_ID");
            entity.Property(e => e.AktifMi)
                .HasDefaultValue(true)
                .HasColumnName("Aktif_Mi");
            entity.Property(e => e.DepartmanAdi)
                .HasMaxLength(100)
                .HasColumnName("Departman_Adi");
            entity.Property(e => e.KurumId).HasColumnName("Kurum_ID");

            entity.HasOne(d => d.Kurum).WithMany(p => p.TblKurumDepartmanlars)
                .HasForeignKey(d => d.KurumId)
                .HasConstraintName("FK__TBL_KURUM__Kurum__403A8C7D");
        });

        modelBuilder.Entity<TblMusteriKurumlar>(entity =>
        {
            entity.HasKey(e => e.KurumId).HasName("PK__TBL_MUST__BE1DBCF7915C16B9");

            entity.ToTable("TBL_MUSTERI_KURUMLAR");

            entity.Property(e => e.KurumId).HasColumnName("Kurum_ID");
            entity.Property(e => e.AdresIl)
                .HasMaxLength(50)
                .HasColumnName("Adres_Il");
            entity.Property(e => e.AdresIlce)
                .HasMaxLength(50)
                .HasColumnName("Adres_Ilce");
            entity.Property(e => e.AktifMi)
                .HasDefaultValue(true)
                .HasColumnName("Aktif_Mi");
            entity.Property(e => e.KurumAdi)
                .HasMaxLength(150)
                .HasColumnName("Kurum_Adi");
            entity.Property(e => e.KurumTipi)
                .HasMaxLength(50)
                .HasColumnName("Kurum_Tipi");
            entity.Property(e => e.Sektor).HasMaxLength(100);
            entity.Property(e => e.SozlesmeBaslangic).HasColumnName("Sozlesme_Baslangic");
            entity.Property(e => e.SozlesmeBitis).HasColumnName("Sozlesme_Bitis");
            entity.Property(e => e.TurizmFirmaId).HasColumnName("Turizm_Firma_ID");
            entity.Property(e => e.VergiNo)
                .HasMaxLength(50)
                .HasColumnName("Vergi_No");

            entity.HasOne(d => d.TurizmFirma).WithMany(p => p.TblMusteriKurumlars)
                .HasForeignKey(d => d.TurizmFirmaId)
                .HasConstraintName("FK__TBL_MUSTE__Turiz__3C69FB99");
        });

        modelBuilder.Entity<TblRoller>(entity =>
        {
            entity.HasKey(e => e.RolId).HasName("PK__TBL_ROLL__795EBD696531067F");

            entity.ToTable("TBL_ROLLER");

            entity.HasIndex(e => e.RolKodu, "UQ__TBL_ROLL__16EADE061098F3CF").IsUnique();

            entity.Property(e => e.RolId).HasColumnName("Rol_ID");
            entity.Property(e => e.RolAdi)
                .HasMaxLength(100)
                .HasColumnName("Rol_Adi");
            entity.Property(e => e.RolKodu)
                .HasMaxLength(50)
                .HasColumnName("Rol_Kodu");
        });

        modelBuilder.Entity<TblRotaDuraklari>(entity =>
        {
            entity.HasKey(e => e.RotaDurakId).HasName("PK__TBL_ROTA__95EE21C6E530398F");

            entity.ToTable("TBL_ROTA_DURAKLARI");

            entity.Property(e => e.RotaDurakId).HasColumnName("Rota_Durak_ID");
            entity.Property(e => e.DurakId).HasColumnName("Durak_ID");
            entity.Property(e => e.HedefVarisSaati).HasColumnName("Hedef_Varis_Saati");
            entity.Property(e => e.KilometreMesafesi)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("Kilometre_Mesafesi");
            entity.Property(e => e.RotaId).HasColumnName("Rota_ID");
            entity.Property(e => e.SiraNo).HasColumnName("Sira_No");

            entity.HasOne(d => d.Durak).WithMany(p => p.TblRotaDuraklaris)
                .HasForeignKey(d => d.DurakId)
                .HasConstraintName("FK__TBL_ROTA___Durak__619B8048");

            entity.HasOne(d => d.Rota).WithMany(p => p.TblRotaDuraklaris)
                .HasForeignKey(d => d.RotaId)
                .HasConstraintName("FK__TBL_ROTA___Rota___60A75C0F");
        });

        modelBuilder.Entity<TblRotalar>(entity =>
        {
            entity.HasKey(e => e.RotaId).HasName("PK__TBL_ROTA__7177918BEDD47233");

            entity.ToTable("TBL_ROTALAR");

            entity.Property(e => e.RotaId).HasColumnName("Rota_ID");
            entity.Property(e => e.AktifMi)
                .HasDefaultValue(true)
                .HasColumnName("Aktif_Mi");
            entity.Property(e => e.CalismaGunleri)
                .HasMaxLength(50)
                .HasColumnName("Calisma_Gunleri");
            entity.Property(e => e.KurumId).HasColumnName("Kurum_ID");
            entity.Property(e => e.OlusturmaTarihi)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("Olusturma_Tarihi");
            entity.Property(e => e.PlanlananBaslangicSaati).HasColumnName("Planlanan_Baslangic_Saati");
            entity.Property(e => e.RotaAdi)
                .HasMaxLength(150)
                .HasColumnName("Rota_Adi");
            entity.Property(e => e.Statu)
                .HasMaxLength(30)
                .HasDefaultValue("Aktif");
            entity.Property(e => e.TahminiSureDakika).HasColumnName("Tahmini_Sure_Dakika");
            entity.Property(e => e.VardiyaTipi)
                .HasMaxLength(50)
                .HasColumnName("Vardiya_Tipi");
            entity.Property(e => e.Yon).HasMaxLength(20);

            entity.HasOne(d => d.Kurum).WithMany(p => p.TblRotalars)
                .HasForeignKey(d => d.KurumId)
                .HasConstraintName("FK__TBL_ROTAL__Kurum__5AEE82B9");
        });

        modelBuilder.Entity<TblSeferAtamalari>(entity =>
        {
            entity.HasKey(e => e.AtamaId).HasName("PK__TBL_SEFE__E8AF538CE4927111");

            entity.ToTable("TBL_SEFER_ATAMALARI");

            entity.Property(e => e.AtamaId).HasColumnName("Atama_ID");
            entity.Property(e => e.AracId).HasColumnName("Arac_ID");
            entity.Property(e => e.SeferId).HasColumnName("Sefer_ID");
            entity.Property(e => e.ServisYoneticisiId).HasColumnName("Servis_Yoneticisi_ID");
            entity.Property(e => e.SoforId).HasColumnName("Sofor_ID");

            entity.HasOne(d => d.Arac).WithMany(p => p.TblSeferAtamalaris)
                .HasForeignKey(d => d.AracId)
                .HasConstraintName("FK__TBL_SEFER__Arac___70DDC3D8");

            entity.HasOne(d => d.Sefer).WithMany(p => p.TblSeferAtamalaris)
                .HasForeignKey(d => d.SeferId)
                .HasConstraintName("FK__TBL_SEFER__Sefer__6FE99F9F");

            entity.HasOne(d => d.ServisYoneticisi).WithMany(p => p.TblSeferAtamalariServisYoneticisis)
                .HasForeignKey(d => d.ServisYoneticisiId)
                .HasConstraintName("FK__TBL_SEFER__Servi__72C60C4A");

            entity.HasOne(d => d.Sofor).WithMany(p => p.TblSeferAtamalariSofors)
                .HasForeignKey(d => d.SoforId)
                .HasConstraintName("FK__TBL_SEFER__Sofor__71D1E811");
        });

        modelBuilder.Entity<TblSeferYoklama>(entity =>
        {
            entity.HasKey(e => e.YoklamaId).HasName("PK__TBL_SEFE__84BE1CD4096F0A2B");

            entity.ToTable("TBL_SEFER_YOKLAMA");

            entity.Property(e => e.YoklamaId).HasColumnName("Yoklama_ID");
            entity.Property(e => e.DurakId).HasColumnName("Durak_ID");
            entity.Property(e => e.IslemZamani)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("Islem_Zamani");
            entity.Property(e => e.IslemiYapanId).HasColumnName("Islemi_Yapan_ID");
            entity.Property(e => e.KatilimDurumu)
                .HasMaxLength(30)
                .HasColumnName("Katilim_Durumu");
            entity.Property(e => e.SeferId).HasColumnName("Sefer_ID");
            entity.Property(e => e.YolcuId).HasColumnName("Yolcu_ID");

            entity.HasOne(d => d.Durak).WithMany(p => p.TblSeferYoklamas)
                .HasForeignKey(d => d.DurakId)
                .HasConstraintName("FK__TBL_SEFER__Durak__7C4F7684");

            entity.HasOne(d => d.IslemiYapan).WithMany(p => p.TblSeferYoklamaIslemiYapans)
                .HasForeignKey(d => d.IslemiYapanId)
                .HasConstraintName("FK__TBL_SEFER__Islem__7E37BEF6");

            entity.HasOne(d => d.Sefer).WithMany(p => p.TblSeferYoklamas)
                .HasForeignKey(d => d.SeferId)
                .HasConstraintName("FK__TBL_SEFER__Sefer__7A672E12");

            entity.HasOne(d => d.Yolcu).WithMany(p => p.TblSeferYoklamaYolcus)
                .HasForeignKey(d => d.YolcuId)
                .HasConstraintName("FK__TBL_SEFER__Yolcu__7B5B524B");
        });

        modelBuilder.Entity<TblSeferler>(entity =>
        {
            entity.HasKey(e => e.SeferId).HasName("PK__TBL_SEFE__1344ABD961AFBF4C");

            entity.ToTable("TBL_SEFERLER");

            entity.Property(e => e.SeferId).HasColumnName("Sefer_ID");
            entity.Property(e => e.BaslamaZamani)
                .HasColumnType("datetime")
                .HasColumnName("Baslama_Zamani");
            entity.Property(e => e.BitisZamani)
                .HasColumnType("datetime")
                .HasColumnName("Bitis_Zamani");
            entity.Property(e => e.RotaId).HasColumnName("Rota_ID");
            entity.Property(e => e.SeferTarihi).HasColumnName("Sefer_Tarihi");
            entity.Property(e => e.Statu)
                .HasMaxLength(30)
                .HasDefaultValue("Planlandi");

            entity.HasOne(d => d.Rota).WithMany(p => p.TblSeferlers)
                .HasForeignKey(d => d.RotaId)
                .HasConstraintName("FK__TBL_SEFER__Rota___6C190EBB");
        });

        modelBuilder.Entity<TblTurizmFirmalari>(entity =>
        {
            entity.HasKey(e => e.TurizmFirmaId).HasName("PK__TBL_TURI__98C5A3AEB7C511CF");

            entity.ToTable("TBL_TURIZM_FIRMALARI");

            entity.HasIndex(e => e.VergiNo, "UQ__TBL_TURI__60E0849FF5C9A326").IsUnique();

            entity.Property(e => e.TurizmFirmaId).HasColumnName("Turizm_Firma_ID");
            entity.Property(e => e.AktifMi)
                .HasDefaultValue(true)
                .HasColumnName("Aktif_Mi");
            entity.Property(e => e.FirmaAdi)
                .HasMaxLength(150)
                .HasColumnName("Firma_Adi");
            entity.Property(e => e.IletisimTel)
                .HasMaxLength(20)
                .HasColumnName("Iletisim_Tel");
            entity.Property(e => e.KayitTarihi)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("Kayit_Tarihi");
            entity.Property(e => e.VergiNo)
                .HasMaxLength(50)
                .HasColumnName("Vergi_No");
            entity.Property(e => e.YetkiliKisi)
                .HasMaxLength(100)
                .HasColumnName("Yetkili_Kisi");
        });

        modelBuilder.Entity<TblYolcuIstisnalari>(entity =>
        {
            entity.HasKey(e => e.IstisnaId).HasName("PK__TBL_YOLC__07288D097B6591F2");

            entity.ToTable("TBL_YOLCU_ISTISNALARI");

            entity.Property(e => e.IstisnaId).HasColumnName("Istisna_ID");
            entity.Property(e => e.Aciklama).HasMaxLength(255);
            entity.Property(e => e.BildirimZamani)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("Bildirim_Zamani");
            entity.Property(e => e.IstisnaTarihi).HasColumnName("Istisna_Tarihi");
            entity.Property(e => e.RotaId).HasColumnName("Rota_ID");
            entity.Property(e => e.YolcuId).HasColumnName("Yolcu_ID");

            entity.HasOne(d => d.Rota).WithMany(p => p.TblYolcuIstisnalaris)
                .HasForeignKey(d => d.RotaId)
                .HasConstraintName("FK__TBL_YOLCU__Rota___76969D2E");

            entity.HasOne(d => d.Yolcu).WithMany(p => p.TblYolcuIstisnalaris)
                .HasForeignKey(d => d.YolcuId)
                .HasConstraintName("FK__TBL_YOLCU__Yolcu__75A278F5");
        });

        modelBuilder.Entity<TblYolcuRotaTercihleri>(entity =>
        {
            entity.HasKey(e => e.TercihId).HasName("PK__TBL_YOLC__5B8A392410191484");

            entity.ToTable("TBL_YOLCU_ROTA_TERCIHLERI");

            entity.Property(e => e.TercihId).HasColumnName("Tercih_ID");
            entity.Property(e => e.AktifMi)
                .HasDefaultValue(true)
                .HasColumnName("Aktif_Mi");
            entity.Property(e => e.BinisDurakId).HasColumnName("Binis_Durak_ID");
            entity.Property(e => e.InisDurakId).HasColumnName("Inis_Durak_ID");
            entity.Property(e => e.RotaId).HasColumnName("Rota_ID");
            entity.Property(e => e.VarsayilanKullanici)
                .HasDefaultValue(true)
                .HasColumnName("Varsayilan_Kullanici");
            entity.Property(e => e.YolcuId).HasColumnName("Yolcu_ID");

            entity.HasOne(d => d.BinisDurak).WithMany(p => p.TblYolcuRotaTercihleriBinisDuraks)
                .HasForeignKey(d => d.BinisDurakId)
                .HasConstraintName("FK__TBL_YOLCU__Binis__66603565");

            entity.HasOne(d => d.InisDurak).WithMany(p => p.TblYolcuRotaTercihleriInisDuraks)
                .HasForeignKey(d => d.InisDurakId)
                .HasConstraintName("FK__TBL_YOLCU__Inis___6754599E");

            entity.HasOne(d => d.Rota).WithMany(p => p.TblYolcuRotaTercihleris)
                .HasForeignKey(d => d.RotaId)
                .HasConstraintName("FK__TBL_YOLCU__Rota___656C112C");

            entity.HasOne(d => d.Yolcu).WithMany(p => p.TblYolcuRotaTercihleris)
                .HasForeignKey(d => d.YolcuId)
                .HasConstraintName("FK__TBL_YOLCU__Yolcu__6477ECF3");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
