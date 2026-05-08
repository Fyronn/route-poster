using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblKullanicilar
{
    public int KullaniciId { get; set; }

    public int? TurizmFirmaId { get; set; }

    public int? KurumId { get; set; }

    public int? DepartmanId { get; set; }

    public int? RolId { get; set; }

    public string? KimlikNo { get; set; }

    public string Ad { get; set; } = null!;

    public string Soyad { get; set; } = null!;

    public string? Email { get; set; }

    public string? Telefon { get; set; }

    public string? SifreHash { get; set; }

    public string? CihazToken { get; set; }

    public DateTime? OlusturmaTarihi { get; set; }

    public bool? AktifMi { get; set; }

    public virtual TblKurumDepartmanlar? Departman { get; set; }

    public virtual TblMusteriKurumlar? Kurum { get; set; }

    public virtual TblRoller? Rol { get; set; }

    public virtual ICollection<TblSeferAtamalari> TblSeferAtamalariServisYoneticisis { get; set; } = new List<TblSeferAtamalari>();

    public virtual ICollection<TblSeferAtamalari> TblSeferAtamalariSofors { get; set; } = new List<TblSeferAtamalari>();

    public virtual ICollection<TblSeferYoklama> TblSeferYoklamaIslemiYapans { get; set; } = new List<TblSeferYoklama>();

    public virtual ICollection<TblSeferYoklama> TblSeferYoklamaYolcus { get; set; } = new List<TblSeferYoklama>();

    public virtual ICollection<TblYolcuIstisnalari> TblYolcuIstisnalaris { get; set; } = new List<TblYolcuIstisnalari>();

    public virtual ICollection<TblYolcuRotaTercihleri> TblYolcuRotaTercihleris { get; set; } = new List<TblYolcuRotaTercihleri>();

    public virtual TblTurizmFirmalari? TurizmFirma { get; set; }
}
