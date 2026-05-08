using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblAraclar
{
    public int AracId { get; set; }

    public int? TurizmFirmaId { get; set; }

    public string Plaka { get; set; } = null!;

    public int Kapasite { get; set; }

    public string? MarkaModel { get; set; }

    public int? UretimYili { get; set; }

    public string? AracTipi { get; set; }

    public string? DonanimOzellikleri { get; set; }

    public bool? AktifMi { get; set; }

    public virtual ICollection<TblAracKonumlari> TblAracKonumlaris { get; set; } = new List<TblAracKonumlari>();

    public virtual ICollection<TblSeferAtamalari> TblSeferAtamalaris { get; set; } = new List<TblSeferAtamalari>();

    public virtual TblTurizmFirmalari? TurizmFirma { get; set; }
}
