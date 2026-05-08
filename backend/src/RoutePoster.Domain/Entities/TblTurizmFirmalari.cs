using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblTurizmFirmalari
{
    public int TurizmFirmaId { get; set; }

    public string FirmaAdi { get; set; } = null!;

    public string? VergiNo { get; set; }

    public string? YetkiliKisi { get; set; }

    public string? IletisimTel { get; set; }

    public DateTime? KayitTarihi { get; set; }

    public bool? AktifMi { get; set; }

    public virtual ICollection<TblAraclar> TblAraclars { get; set; } = new List<TblAraclar>();

    public virtual ICollection<TblDuraklar> TblDuraklars { get; set; } = new List<TblDuraklar>();

    public virtual ICollection<TblKullanicilar> TblKullanicilars { get; set; } = new List<TblKullanicilar>();

    public virtual ICollection<TblMusteriKurumlar> TblMusteriKurumlars { get; set; } = new List<TblMusteriKurumlar>();
}
