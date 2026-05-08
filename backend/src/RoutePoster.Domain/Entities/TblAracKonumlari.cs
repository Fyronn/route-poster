using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblAracKonumlari
{
    public long KonumId { get; set; }

    public int? SeferId { get; set; }

    public int? AracId { get; set; }

    public decimal Enlem { get; set; }

    public decimal Boylam { get; set; }

    public int? HizKmH { get; set; }

    public DateTime? KayitZamani { get; set; }

    public virtual TblAraclar? Arac { get; set; }

    public virtual TblSeferler? Sefer { get; set; }
}
