using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblMusteriKurumlar
{
    public int KurumId { get; set; }

    public int? TurizmFirmaId { get; set; }

    public string KurumAdi { get; set; } = null!;

    public string? KurumTipi { get; set; }

    public string? Sektor { get; set; }

    public string? VergiNo { get; set; }

    public string? AdresIl { get; set; }

    public string? AdresIlce { get; set; }

    public DateOnly? SozlesmeBaslangic { get; set; }

    public DateOnly? SozlesmeBitis { get; set; }

    public bool? AktifMi { get; set; }

    public virtual ICollection<TblDuraklar> TblDuraklars { get; set; } = new List<TblDuraklar>();

    public virtual ICollection<TblKullanicilar> TblKullanicilars { get; set; } = new List<TblKullanicilar>();

    public virtual ICollection<TblKurumDepartmanlar> TblKurumDepartmanlars { get; set; } = new List<TblKurumDepartmanlar>();

    public virtual ICollection<TblRotalar> TblRotalars { get; set; } = new List<TblRotalar>();

    public virtual TblTurizmFirmalari? TurizmFirma { get; set; }
}
